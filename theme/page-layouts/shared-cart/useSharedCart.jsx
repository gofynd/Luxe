import React, { useEffect, useMemo, useState, useRef } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "../../helper/hooks";
import {
  SHARED_CART_DETAILS,
  UPDATE_CART_WITH_SHARED_ITEMS,
} from "../../queries/sharedCartQuery";

const useSharedCart = (fpi) => {
  const CART = useGlobalStore(fpi.getters.CART);
  const params = useParams();
  const token = useRef(params.token);
  const [sharedCart, setSharedCart] = useState(null);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const payload = {
      token: token?.current?.toString(),
    };
    fpi.executeGQL(SHARED_CART_DETAILS, payload).then((res) => {
      setSharedCart(res?.data?.sharedCartDetails?.cart);
    });
  }, [fpi]);

  const bagItems = useMemo(() => {
    if (sharedCart && sharedCart?.items) {
      const allItems = sharedCart.items.map((item, index) => ({
        ...item,
        item_index: index,
      }));
      // return allItems;
      /* eslint no-param-reassign: "error" */
      const grpBySameSellerAndProduct = allItems.reduce((result, item) => {
        result[
          `${item.article.seller.uid}${item.article.store.uid}${item.product.uid}`
        ] = (
          result[
            `${item.article.seller.uid}${item.article.store.uid}${item.product.uid}`
          ] || []
        ).concat(item);
        return result;
      }, []);

      const updateArr = [];
      Object.entries(grpBySameSellerAndProduct).forEach(([key, value]) => {
        updateArr.push({
          item: value[0],
          articles: value,
        });
      });
      return updateArr;
    }
    return [];
  }, [sharedCart]);

  const showReplaceBtn = useMemo(() => {
    if (CART) {
      return CART?.cart_items?.items?.length > 0;
    }
    return true;
  }, [CART]);

  const updateCartWithSharedItem = (action, successInfo = null) => {
    try {
      const payload = {
        action,
        token: token?.current?.toString(),
      };
      fpi.executeGQL(UPDATE_CART_WITH_SHARED_ITEMS, payload).then((res) => {
        if (res?.errors) {
          showSnackbar(
            res?.errors?.message || `Failed to ${action} the cart`,
            "error"
          );
        } else {
          showSnackbar(
            successInfo ?? `Cart ${action}d successfully`,
            "success"
          );
          navigate("/cart/bag/");
        }
      });
    } catch (err) {
      showSnackbar(err?.message || "Something went wrong", "error");
    }
  };

  const onAddToBagClick = () => {
    const info = "Cart Items added successfully";
    updateCartWithSharedItem("merge", info);
  };
  const onMergeBagClick = () => {
    updateCartWithSharedItem("merge");
  };
  const onReplaceBagClick = () => {
    updateCartWithSharedItem("replace");
  };

  return {
    sharedCartData: sharedCart,
    bagItems,
    showReplaceBtn,
    onMergeBagClick,
    onAddToBagClick,
    onReplaceBagClick,
  };
};

export default useSharedCart;
