import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GET_QUICK_VIEW_PRODUCT_DETAILS } from "../../queries/plpQuery";
import { FEATURE_PRODUCT_SIZE_PRICE } from "../../queries/featureProductQuery";
import { useGlobalStore } from "fdk-core/utils";
import { LOCALITY } from "../../queries/logisticsQuery";
import { ADD_TO_CART } from "../../queries/pdpQuery";
import useCart, { fetchCartDetails } from "../cart/useCart";
import { useSnackbar, useHyperlocalTat } from "../../helper/hooks";

const useAddToCartModal = ({ fpi, pageConfig }) => {
  const locationDetails = useGlobalStore(fpi?.getters?.LOCATION_DETAILS);
  const pincodeDetails = useGlobalStore(fpi?.getters?.PINCODE_DETAILS);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState({
    product: {},
    productPrice: {},
  });
  const [slug, setSlug] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [currentPincode, setCurrentPincode] = useState(
    (pincodeDetails?.localityValue ?? locationDetails?.pincode) || ""
  );
  const [selectPincodeError, setSelectPincodeError] = useState(false);
  const [pincodeErrorMessage, setPincodeErrorMessage] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { isHyperlocal } = useHyperlocalTat({ fpi });

  const { onUpdateCartItems, isCartUpdating, cartItems } = useCart(fpi);

  const isMto = useMemo(
    () => productData?.product?.custom_order?.is_custom_order || false,
    [productData?.product]
  );

  const fetchProductPrice = useCallback(
    async (size, productSlug) => {
      try {
        const productPriceData = await fpi.executeGQL(
          FEATURE_PRODUCT_SIZE_PRICE,
          {
            slug: productSlug || slug,
            pincode: currentPincode || "",
            size:
              size ||
              selectedSize ||
              productData?.product?.sizes?.sizes[0]?.value,
          },
          { skipStoreUpdate: true }
        );

        return productPriceData;
      } catch (error) {
        console.error(error);
      }
    },
    [slug, currentPincode, selectedSize, productData?.product, fpi]
  );

  const fetchProductData = useCallback(
    async (slug) => {
      try {
        const productDetails = await fpi.executeGQL(
          GET_QUICK_VIEW_PRODUCT_DETAILS,
          { slug },
          { skipStoreUpdate: true }
        );

        const productPriceData = await fetchProductPrice(
          productDetails?.data?.product?.sizes?.sizes[0]?.value,
          productDetails?.data?.product?.slug
        );

        setProductData({
          productPrice: productPriceData?.data?.productPrice || {},
          product: productDetails?.data?.product,
        });
        setSlug(productDetails?.data?.product?.slug);
      } catch (error) {
        console.error(error);
      }
    },
    [fetchProductPrice, fpi]
  );

  const handleAddToCart = useCallback(
    async (productSlug) => {
      setIsOpen(true);
      setIsLoading(true);
      await fetchProductData(productSlug);
      setIsLoading(false);
    },
    [fetchProductData]
  );

  const onSizeSelection = useCallback(
    async (sizeValue) => {
      const size = productData?.product?.sizes?.sizes?.find(
        (size) => size.value === sizeValue
      );
      if (size?.quantity === 0 && !isMto) {
        return;
      }
      setSelectedSize(sizeValue);
      setSizeError(false);

      const productPriceData = await fetchProductPrice(sizeValue);
      setProductData((prevData) => ({
        ...prevData,
        productPrice: productPriceData?.data?.productPrice || {},
      }));
    },
    [isMto, fetchProductPrice]
  );

  const handleClose = useCallback(() => {
    if (!showSizeGuide) {
      setIsOpen(false);
      setIsLoading(false);
      setProductData({ product: {}, productPrice: {} });
      setSelectedSize("");
      setSelectPincodeError(false);
      setPincodeErrorMessage("");
      setSlug("");
    }
  }, [showSizeGuide]);

  const handleSlugChange = useCallback(
    async (productSlug) => {
      await fetchProductData(productSlug);
    },
    [fetchProductData]
  );

  const checkPincode = useCallback(
    async (postCode) => {
      try {
        const localityData = await fpi.executeGQL(LOCALITY, {
          locality: `pincode`,
          localityValue: `${postCode}`,
        });

        if (localityData?.data?.locality) {
          const productPriceData = await fetchProductPrice();
          setProductData((prevData) => ({
            ...prevData,
            productPrice: productPriceData?.data?.productPrice || {},
          }));
        } else {
          setPincodeErrorMessage(
            localityData?.errors?.[0]?.message || "Pincode verification failed"
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
    [fetchProductPrice, fpi]
  );

  const handleViewMore = useCallback(() => {
    navigate(`/product/${productData?.product?.slug}`);
  }, [navigate, productData]);

  const handleSetSlug = useCallback((code) => {
    setSelectPincodeError(false);
    setCurrentPincode(code);
  }, []);

  const handleCloseSizeGuide = useCallback((event) => {
    event?.preventDefault();
    event?.stopPropagation();
    setShowSizeGuide(false);
  }, []);

  const handleShowSizeGuide = useCallback(() => {
    setShowSizeGuide(true);
  }, []);

  const addProductForCheckout = useCallback(
    async (event, size, buyNow = false) => {
      if (event) {
        event.stopPropagation();
      }

      if (
        pageConfig?.mandatory_pincode &&
        (currentPincode?.length !== 6 || pincodeErrorMessage.length)
      ) {
        setSelectPincodeError(true);
        setPincodeErrorMessage("");
        return;
      }
      if (
        !pageConfig?.mandatory_pincode &&
        ((currentPincode?.length > 0 && currentPincode?.length < 6) ||
          pincodeErrorMessage.length)
      ) {
        setSelectPincodeError(true);
        setPincodeErrorMessage("");
        return;
      }
      if (
        !pageConfig?.mandatory_pincode &&
        (!currentPincode?.length || currentPincode?.length === 6) &&
        !pincodeErrorMessage.length
      ) {
        setSelectPincodeError(false);
        setPincodeErrorMessage("");
      }

      if (!size) {
        setSizeError(true);
        return;
      }

      if (productData?.productPrice !== null) {
        let quantity = "";

        const moq = productData?.product?.moq || false;
        const availableQty = selectedSize?.quantity;
        if (moq) {
          quantity =
            availableQty > moq?.increment_unit
              ? moq?.increment_unit
              : (moq?.minimum ?? 1);
        }

        const payload = {
          buyNow,
          areaCode: currentPincode?.toString(),
          addCartRequestInput: {
            items: [
              {
                article_assignment: {
                  level: `${productData?.productPrice?.article_assignment?.level}`,
                  strategy: `${productData?.productPrice?.article_assignment?.strategy}`,
                },
                article_id: productData?.productPrice?.article_id?.toString(),
                item_id: productData?.product?.uid,
                item_size: size?.toString(),
                quantity,
                seller_id: productData?.productPrice?.seller?.uid,
                store_id: productData?.productPrice?.store?.uid,
              },
            ],
          },
        };

        return fpi.executeGQL(ADD_TO_CART, payload).then((outRes) => {
          if (outRes?.data?.addItemsToCart?.success) {
            if (!buyNow) fetchCartDetails(fpi);
            showSnackbar(
              outRes?.data?.addItemsToCart?.message || "Added to Cart",
              "success"
            );
            if (buyNow) {
              navigate(
                `/cart/checkout/?buy_now=true&id=${outRes?.data?.addItemsToCart?.cart?.id}`
              );
            }
          } else {
            showSnackbar(
              outRes?.data?.addItemsToCart?.message || "Failed to add to cart",
              "error"
            );
          }
          return outRes;
        });
      }
    },
    [
      pageConfig,
      currentPincode,
      pincodeErrorMessage,
      sizeError,
      productData,
      selectedSize,
      fpi,
      fetchCartDetails,
      showSnackbar,
      navigate,
    ]
  );

  const selectedItemDetails = useMemo(() => {
    let currentItemDetails = {};

    if (selectedSize) {
      const cartItemsKey = Object.keys(cartItems || {});
      const selectedItemKey = `${productData?.product?.uid}_${selectedSize}`;

      cartItemsKey.some((item, index) => {
        if (item === selectedItemKey) {
          currentItemDetails = { ...cartItems[item], itemIndex: index };
          return true;
        }

        return false;
      });
    }

    return currentItemDetails;
  }, [selectedSize, cartItems]);

  const selectedSizeDetails = useMemo(() => {
    return productData?.product?.sizes?.sizes?.find(
      ({ value }) => selectedSize === value
    );
  }, [selectedSize]);

  const moq = productData?.product?.moq;
  const incrementDecrementUnit = moq?.increment_unit ?? 1;
  const minCartQuantity = moq?.minimum || 1;
  const maxCartQuantity = Math.min(
    moq?.maximum || Number.POSITIVE_INFINITY,
    selectedSizeDetails?.quantity || 0
  );

  const cartUpdateHandler = async (event, quantity, operation) => {
    let totalQuantity = (selectedItemDetails?.quantity || 0) + quantity;

    if (operation === "edit_item") {
      totalQuantity = quantity;
    }

    if (!isMto) {
      if (totalQuantity > maxCartQuantity) {
        totalQuantity = maxCartQuantity;
        showSnackbar(`Maximum quantity is ${maxCartQuantity}.`, "error");
      }

      if (totalQuantity < minCartQuantity) {
        if (operation === "edit_item") {
          totalQuantity = minCartQuantity;
          showSnackbar(`Minimum quantity is ${minCartQuantity}.`, "error");
        } else if (selectedItemDetails?.quantity > minCartQuantity) {
          totalQuantity = minCartQuantity;
        } else {
          totalQuantity = 0;
        }
      }
    }

    if (selectedItemDetails?.quantity !== totalQuantity) {
      onUpdateCartItems(
        event,
        selectedItemDetails,
        selectedSize,
        totalQuantity,
        selectedItemDetails?.itemIndex,
        "update_item"
      );
    }
  };

  useEffect(() => {
    setCurrentPincode(
      (pincodeDetails?.localityValue ?? locationDetails?.pincode) || ""
    );
  }, [pincodeDetails, locationDetails]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentPincode(
        (pincodeDetails?.localityValue ?? locationDetails?.pincode) || ""
      );
    }
  }, [isOpen]);

  return {
    isOpen,
    isLoading,
    productData,
    pageConfig,
    slug,
    selectedSize,
    showSizeGuide,
    sizeError,
    deliverInfoProps: useMemo(
      () => ({
        pincode: currentPincode,
        tat: productData?.productPrice?.delivery_promise,
        selectPincodeError,
        pincodeErrorMessage,
        setCurrentPincode: handleSetSlug,
        checkPincode,
        fpi,
        setPincodeErrorMessage,
      }),
      [
        currentPincode,
        productData?.productPrice,
        selectPincodeError,
        pincodeErrorMessage,
        handleSetSlug,
        checkPincode,
        fpi,
      ]
    ),
    selectedItemDetails,
    isCartUpdating,
    isHyperlocal,
    cartUpdateHandler,
    maxCartQuantity,
    incrementDecrementUnit,
    minCartQuantity,
    handleClose,
    handleAddToCart,
    handleSlugChange,
    onSizeSelection,
    addProductForCheckout,
    handleViewMore,
    handleCloseSizeGuide,
    handleShowSizeGuide,
  };
};

export default useAddToCartModal;
