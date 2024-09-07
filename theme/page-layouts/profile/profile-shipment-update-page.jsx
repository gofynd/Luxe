import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FDKLink } from "fdk-core/components";
import styles from "./styles/profile-shipment-update-page.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import useShipmentDetails from "../orders/useShipmentDetails";
import Loader from "../../components/loader/loader";
import ProfileRoot from "../../components/profile/profile-root";
import OrdersHeader from "../../components/orders/order-header";
import useRefundDetails from "../orders/useRefundDetails";
import ShipmentUpdateItem from "../../components/orders/shipments-update-item";
import BeneficiaryList from "../../components/orders/beneficiary-list";
import BeneficiaryItem from "../../components/orders/beneficiary-list-item";
import UpateReasons from "../../components/orders/upate-reasons";
import ReasonItem from "../../components/orders/reason-item";
import AddPayment from "../../components/orders/add-payment";
import { useSnackbar } from "../../helper/hooks";

function ProfileShipmentUpdatePage({ fpi }) {
  const navigate = useNavigate();
  const location = useLocation();
  const DEFAULT_ERROR_TEXT = "Something went wrong";
  const [updatedQty, setUpdatedQty] = useState("");
  const [selectedBagId, setSelectedBagId] = useState("");
  const [extraComment, setExtraComment] = useState("");
  const [type, setType] = useState("");
  const [reasonList, setReasonsList] = useState([]);
  const [previewList, setPreviewList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [cdnUrls, setCdnUrls] = useState([]);
  const [accordianlv1, setAccordianlv1] = useState({});
  const [selectedReason, setSelectedReason] = useState({});
  const [showReasonsAccordion, setShowReasonsAccordion] = useState({ 0: true });
  const [selectedBeneficary, setSelectedBeneficary] = useState(null);
  const [showBeneficiariesAccordion, setShowBeneficiariesAccordion] =
    useState(false);
  const [confirmReturn, setConfirmReturn] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("Something went wrong");
  const { showSnackbar } = useSnackbar();
  const {
    isLoading,
    shipmentDetails,
    reasonsList,
    getBagReasons,
    updateShipment,
  } = useShipmentDetails(fpi);
  const { refundDetails, getRefundDetails } = useRefundDetails(fpi);

  const queryParams = new URLSearchParams(location.search);
  const selected_bag_id = queryParams.get("selectedBagId") || "";
  const updateType = () => {
    if (shipmentDetails) {
      if (shipmentDetails?.can_cancel) {
        return "Cancel";
      } else if (shipmentDetails?.can_return) {
        return "Return";
      }
      return "";
    }
  };
  useEffect(() => {
    if (shipmentDetails?.order_id) {
      getBagReasons({
        shipmentId: shipmentDetails?.shipment_id,
        bagId: selected_bag_id,
      });
      getRefundDetails(shipmentDetails?.order_id);
    }
    return () => {};
  }, [shipmentDetails?.order_id]);

  useEffect(() => {
    setAccordianlv1({
      0: reasonsList.reasons,
    });
    return () => {};
  }, [reasonsList]);
  useEffect(() => {
    if (shipmentDetails) {
      const bags = shipmentDetails?.bags;
      const filterBag = bags?.filter(
        (item) => item.id === Number(selected_bag_id)
      );
      const finalbag = filterBag?.map((item) => {
        return {
          ...item,
          bag_ids: [selected_bag_id],
        };
      });
      setUpdatedQty(finalbag?.[0]?.quantity);
    }
  }, [shipmentDetails?.bags]);
  const getBag = useMemo(() => {
    if (shipmentDetails) {
      const bags = shipmentDetails?.bags;
      const filterBag = bags?.filter(
        (item) => item.id === Number(selected_bag_id)
      );
      const finalbag = filterBag?.map((item) => {
        return {
          ...item,
          bag_ids: [selected_bag_id],
        };
      });
      return finalbag;
    }
  }, [shipmentDetails?.bags]);
  const UpdatedQuantity = (qty) => {
    setUpdatedQty(qty);
  };
  const onDontUpdate = () => {
    navigate(`/profile/orders/shipment/${shipmentDetails?.shipment_id}`);
  };
  const showimg = () => {
    return (
      selectedReason[selectLast()]?.reasons?.length === 0 &&
      getStatusForUpdate() === "return_pre_qc"
    );
  };

  const selectLast = () => {
    return Object.keys(selectedReason)[Object.keys(selectedReason).length - 1];
  };
  const getStatusForUpdate = () => {
    if (shipmentDetails?.can_cancel) {
      return "cancelled_customer";
    } else if (shipmentDetails?.can_return) {
      return selectedReason[selectLast()].qc_type.includes("pre_qc")
        ? "return_pre_qc"
        : "return_initiated";
    }
  };
  const toggelAccordian = (idx, status) => {
    const obj = { ...showReasonsAccordion };
    // explicitly close the accordian if close status is given
    if (status === "close") {
      obj[idx] = false;
    }
    // explicitly Open the accordian if open status is given
    else if (status === "open") {
      obj[idx] = true;
    }
    // Toggle accordian if status not given & Only one accordian will be open at a time
    else {
      for (const key in obj) {
        if (+key === +idx) {
          obj[idx] = !obj[idx];
        } else {
          obj[key] = false;
        }
      }
    }
    setShowReasonsAccordion({ ...obj });
  };
  const onReasonChange = (reason, idx) => {
    const listObj = deleteNext(accordianlv1, idx);
    if (reason?.reasons?.length > 0) {
      setAccordianlv1({
        ...listObj,
        [+idx + 1]: reason.reasons,
      });
    } else {
      setAccordianlv1({ ...listObj });
    }
    const selectObj = deleteNext(selectedReason, idx);

    setSelectedReason({
      ...selectObj,
      [+idx]: reason,
    });

    const obj = { ...showReasonsAccordion };

    // On Selecting reason close All past Accordian and open next Reason accordian
    // basically one accordian at a time will be opened.
    for (const key in obj) {
      if (+key < +idx + 1) {
        toggelAccordian(+key, "close");
      }
    }

    toggelAccordian(+idx + 1, "open");
  };

  const onOtherReason = (event, i) => {
    // selectedReason[i]["reason_other_text"] = event;
    // setSelectedReason(selectedReason);
  };
  const beneficiaryError = () => {
    return refundDetails?.userBeneficiariesDetail?.beneficiaries?.length > 0
      ? "Please select any one refund option"
      : "Please add a payment method";
  };
  const showSuccess = (type) => {
    if (type === "payment") {
      getRefundDetails(shipmentDetails?.order_id);
    } else if (type === "refund") {
      redirectToOrders();
    }
    setType(type);
  };
  const getBeneficiaryDetails = () => {
    getRefundDetails(shipmentDetails?.order_id);
  };
  const onBeneficiariesChange = (beneficiary) => {
    setSelectedBeneficary(beneficiary);
    accordianBeneficiaries();
  };
  const accordianBeneficiaries = () => {
    setShowBeneficiariesAccordion(!showBeneficiariesAccordion);
  };
  const deleteNext = (obj, idx) => {
    const select = { ...obj };
    for (const key in select) {
      if (+key > +idx) {
        delete select[key];
      }
    }
    return select;
  };
  const buttondisable = useMemo(() => {
    return shipmentDetails?.can_cancel
      ? !(selectLast() && !selectedReason[selectLast()].reasons?.length > 0)
      : !(
          selectLast() &&
          !selectedReason[selectLast()].reasons?.length > 0 &&
          (showimg() ? imageList.length > 0 : true)
        );
  }, [shipmentDetails, selectedReason, imageList]);
  const getUpdatedBagsList = () => {
    const arrBags = [];
    return arrBags;
  };
  const getProductDetails = () => {
    const quantity = updatedQty;
    const line_number = getBag?.[0].line_number;
    const identifier = getBag?.[0].seller_identifier;
    const productsArr = [{ quantity, line_number, identifier }];
    return productsArr;
  };

  const getUpdateConfigParams = (reason, cdn_urls) => {
    const getProducts = getProductDetails();

    if (shipmentDetails?.can_cancel) {
      return {
        shipmentId: shipmentDetails?.shipment_id,
        updateShipmentStatusRequestInput: {
          force_transition: true,

          statuses: [
            {
              shipments: [
                {
                  identifier: shipmentDetails?.shipment_id,
                  products: getProducts,
                  reasons: {
                    products: [
                      {
                        data: {
                          reason_id: reason[selectLast()]?.id,
                          reason_text: reason[selectLast()]?.reason_other_text,
                        },
                        filters: getProducts,
                      },
                    ],
                  },
                },
              ],
              status: "cancelled_customer",
            },
          ],
        },
        order_id: shipmentDetails?.order_id,
        products: getProducts,
        selected_reason: { ...reason[selectLast()] },
        other_reason_text: extraComment,
      };
    } else {
      return {
        shipmentId: shipmentDetails?.shipment_id,
        updateShipmentStatusRequestInput: {
          force_transition: true,

          statuses: [
            {
              shipments: [
                {
                  identifier: shipmentDetails?.shipment_id,
                  products: getProducts,
                  reasons: {
                    products: [
                      {
                        data: {
                          reason_id: reason[selectLast()]?.id,
                          reason_text: reason[selectLast()]?.reason_other_text,
                        },
                        filters: getProducts,
                      },
                    ],
                  },
                },
              ],
              status: "return_initiated",
            },
          ],
        },
        shimpment_id: shipmentDetails?.shipment_id,
        order_id: shipmentDetails?.order_id,
        selected_reason: { ...reason[selectLast()] },
        other_reason_text: extraComment,
        beneficiary_id: refundDetails?.userBeneficiariesDetail
          ?.show_beneficiary_details
          ? selectedBeneficary?.beneficiary_id
          : "",
        qc_image_urls: cdn_urls,
        products: getProducts,
      };
    }
  };

  const setUpdatedOrders = (obj) => {
    setInProgress(true);
    if (shipmentDetails?.can_cancel) {
      updateShipment(obj, "cancel");
    }
    if (shipmentDetails?.can_return) {
      updateShipment(obj, "return");
    }
  };
  const redirectToOrders = () => {
    navigate(`/profile/orders?selected_date_filter=730`);
  };
  const showUpdateErrorText = (text) => {
    setConfirmReturn(false);
    setUpdateError(true);
    setInProgress(false);
    window.scrollTo(0, 0);
    if (text) {
      showSnackbar(text.toString(), "error");
    } else {
      showSnackbar(DEFAULT_ERROR_TEXT, "error");
    }
  };
  const onUpdate = () => {
    if (getStatusForUpdate() === "return_pre_qc") {
      const images = imageList.filter((item) =>
        ["image/png", "image/jpg", "image/jpeg"].includes(item.type)
      );
      const videos = imageList.filter((item) =>
        ["video/quicktime", "video/mp4"].includes(item.type)
      );
      if (images.length > 4)
        return showUpdateErrorText("Maximum 4 images are allowed to upload");
      if (videos.length > 1)
        return showUpdateErrorText("Maximum 1 video is allowed to upload");
      if (images.length < 2)
        return showUpdateErrorText("Minimum 2 images are required to upload");

      const filesizecheck = images.every((item) => item.size / 1000 < 5000);

      if (!filesizecheck)
        return showUpdateErrorText("Image size should not be more than 5MB");
      if (videos?.length) {
        const filesizecheckvideo = videos.every(
          (item) => item.size / 1000 < 25000
        );

        if (!filesizecheckvideo)
          return showUpdateErrorText("video size should not be more than 25MB");
      }

      const filetype = imageList.every((item) =>
        [
          "image/png",
          "image/jpg",
          "image/jpeg",
          "video/quicktime",
          "video/mp4",
        ].includes(item.type)
      );
      if (!filetype)
        return showUpdateErrorText(
          "Only JPG,PNG images and MOV,MP4 videos are supported. Please upload a valid file."
        );
    }

    if (getStatusForUpdate() === "return_pre_qc") {
      setInProgress(true);
      const imgRes = [];
      setInProgress(false);
      setCdnUrls(
        imgRes.map((item) => {
          return { desc: "", url: item.cdn.url };
        })
      );
    } else {
      setCdnUrls([]);
    }

    const reason = selectedReason;
    if (
      reason[0]?.display_name === "Others" &&
      reason[0]?.reason_other_text.length <= 0
    ) {
      return showUpdateErrorText(
        "Please write a reason for cancellation, as it will help us serve you better"
      );
    } else if (!reason) {
      return showUpdateErrorText("Please select any one of the below reason");
    } else if (
      !selectedBeneficary &&
      shipmentDetails?.can_return &&
      refundDetails?.userBeneficiariesDetail?.show_beneficiary_details
    ) {
      return showUpdateErrorText(beneficiaryError());
    }

    const config = getUpdateConfigParams(reason, cdnUrls);
    setUpdatedOrders(config);
  };
  return (
    <ProfileRoot fpi={fpi}>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={`${styles.basePageContainer}`}>
          {!shipmentDetails && (
            <div className={`${styles.error} ${styles.shipment}`}>
              <span className={`${styles.bold}`}>No results found</span>
              <FDKLink to="/" className={`${styles.continueShoppingBtn}`}>
                RETURN TO HOMEPAGE
              </FDKLink>
            </div>
          )}
          {shipmentDetails && (
            <div className={` ${styles.shipment}`}>
              {shipmentDetails && (
                <OrdersHeader
                  flag={true}
                  title={`Please select an item to ${updateType()?.toLowerCase()}`}
                ></OrdersHeader>
              )}
              {getBag?.map(
                (item, index) => (
                  <ShipmentUpdateItem
                    key={`shipment_item${index}`}
                    selectedBagId={selected_bag_id}
                    UpdatedQuantity={(e) => UpdatedQuantity(e)}
                    item={item}
                  ></ShipmentUpdateItem>
                )
                //   }
              )}
              <div className={`${styles.divider}`}></div>
              <div className={`${styles.reasonsList}`}>
                {Object.values(accordianlv1).map((item, i) => (
                  <div className={`${styles.accordion}`} key={i}>
                    <div
                      className={`${styles.accordion} ${styles.accordion__header}`}
                      onClick={() => toggelAccordian(i)}
                    >
                      {i === 0 && (
                        <OrdersHeader
                          flag={true}
                          className={`${styles.refundTitle}`}
                          title={`Reason for ${updateType()?.toLowerCase()}`}
                        ></OrdersHeader>
                      )}
                      {i !== 0 && (
                        <OrdersHeader
                          flag={true}
                          className={`${styles.refundTitle}`}
                          title="More Details"
                        ></OrdersHeader>
                      )}
                      <SvgWrapper
                        svgSrc="arrowDropdownBlack"
                        className={`${showReasonsAccordion[i] ? styles.rotate : ""} ${styles.animate}`}
                      />
                    </div>
                    {/* <ukt-accordion> */}
                    {showReasonsAccordion[i] && (
                      <UpateReasons
                        reasons={item}
                        change={(e) => onReasonChange(e, i)}
                        selectedReason={selectedReason[i]}
                        otherReason={(e) => onOtherReason(e, i)}
                      ></UpateReasons>
                    )}
                    {/* </ukt-accordion> */}
                    {selectedReason[i]?.id && !showReasonsAccordion[i] && (
                      <div className={`${styles.selectedReason}`}>
                        <ReasonItem
                          reason={selectedReason[i]}
                          selectedReason={selectedReason[i]}
                        ></ReasonItem>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {shipmentDetails?.beneficiary_details &&
                shipmentDetails?.can_return &&
                refundDetails?.userBeneficiariesDetail
                  ?.show_beneficiary_details && (
                  <div className={`${styles.divider}`}></div>
                )}
              {shipmentDetails?.beneficiary_details &&
                shipmentDetails?.can_return &&
                refundDetails?.userBeneficiariesDetail
                  ?.show_beneficiary_details && (
                  <div>
                    <div className={`${styles.accordion}`}>
                      <div
                        className={`${styles.accordion__header}`}
                        onClick={accordianBeneficiaries}
                      >
                        <OrdersHeader
                          flag={true}
                          className={`${styles.refundTitle}`}
                          title="Select refund option"
                        ></OrdersHeader>
                        <SvgWrapper
                          svgSrc="arrowDropdownBlack"
                          className={`${showBeneficiariesAccordion ? styles.rotate : ""} ${styles.animate}`}
                        />
                      </div>
                    </div>
                    <div>
                      {showBeneficiariesAccordion && (
                        <>
                          <BeneficiaryList
                            className={`${styles.beneficiaryList}`}
                            beneficiaries={
                              refundDetails?.userBeneficiariesDetail
                                ?.beneficiaries
                            }
                            change={onBeneficiariesChange}
                            selectedBeneficiary={selectedBeneficary}
                          ></BeneficiaryList>
                          {shipmentDetails && (
                            <AddPayment
                              shipment={shipmentDetails}
                              fpi={fpi}
                              getBeneficiaryDetails={getBeneficiaryDetails}
                            ></AddPayment>
                          )}
                        </>
                      )}
                    </div>
                    {selectedBeneficary && !showBeneficiariesAccordion && (
                      <BeneficiaryItem
                        beneficiary={selectedBeneficary}
                        selectedBeneficiary={selectedBeneficary}
                      ></BeneficiaryItem>
                    )}
                  </div>
                )}
              {showimg() && <div className={`${styles.divider}`}></div>}
              {showimg() && (
                <div className={`${styles.cancelimg}`}>
                  <div className={`${styles.header} ${styles.boldmd}`}>
                    Add product images <span>*</span>
                  </div>
                  <div className={`${styles.addPhoto} ${styles.boldmd}`}>
                    <SvgWrapper svgSrc="add-photo" />
                    <div className={`${styles.addImg}`} htmlFor="my-file">
                      Add Images / Videos
                    </div>
                    <input
                      type="file"
                      accept="video/*, image/*"
                      multiple="multiple"
                      onChange="previewMultiImage"
                      className={`${styles.formControlFile}`}
                      id="my-file"
                    />
                  </div>
                  <div className={`${styles.makesure}`}>
                    Make sure the product tag is visible in the picture.
                  </div>
                  <div className={`${styles.accept}`}>
                    Accepted image formats jpg & png , File size should be less
                    than 5mb
                  </div>
                  <div className={`${styles.accept}`}>
                    Accepted Video formats MP4, MOV , File size should be less
                    than 25mb
                  </div>
                  {previewList.length > 0 && (
                    <div className={`${styles.previewImg}`}>
                      {previewList?.map((item, index) => (
                        <div key={index}>
                          <span></span>
                          {item.includes("data:video") && (
                            <video
                              width="120px"
                              height="120px"
                              muted
                              autoPlay
                              loop
                            >
                              <source src="item" type="video/quicktime" />
                              <source src="item" type="video/mp4" />
                            </video>
                          )}
                          <div onClick="removeImg(index)">
                            <SvgWrapper
                              svgSrc="close-photo"
                              className={`${styles.svg}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className={`${styles.divider}`}></div>
              <div className={`${styles.textarea}`}>
                <div>
                  Comments <span>(Optional)</span>
                </div>
                <textarea
                  placeholder="Enter reason"
                  value={extraComment}
                  onChange={(e) => setExtraComment(e.target.value)}
                ></textarea>
              </div>

              <div className={`${styles.updateBtns}`}>
                <button
                  type="button"
                  className={`${styles.commonBtn} ${styles.btn} ${styles.cancelBtn}`}
                  onClick={onDontUpdate}
                >
                  Don&apos;t {updateType()}
                </button>
                <button
                  type="button"
                  className={`${styles.commonBtn} ${styles.btn}`}
                  disabled={buttondisable}
                  onClick={() => onUpdate()}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </ProfileRoot>
  );
}

export default ProfileShipmentUpdatePage;
