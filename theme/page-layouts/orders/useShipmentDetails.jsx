import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  GET_SHIPMENT_DETAILS,
  SHIPMENT_REASONS,
  SHIPMENT_INVOICE,
  UPDATE_SHIPMENT_STATUS,
} from "../../queries/shipmentQuery";
import { useSnackbar } from "../../helper/hooks";

const useShipmentDetails = (fpi) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { showSnackbar } = useSnackbar();
  const [shipmentDetails, setShipmentDetails] = useState({});
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const [reasonsList, setReasonsList] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const values = {
        shipmentId: params.shipmentId || "",
      };

      fpi
        .executeGQL(GET_SHIPMENT_DETAILS, values)
        .then((res) => {
          if (res?.data?.shipment) {
            const data = res?.data?.shipment?.detail;
            setShipmentDetails(data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.log({ error });
      setIsLoading(false);
    }
  }, [location.search]);

  function getBagReasons(bagObj) {
    setIsLoading(true);
    try {
      fpi
        .executeGQL(SHIPMENT_REASONS, bagObj)
        .then((res) => {
          if (res?.data?.shipment) {
            const data = res?.data?.shipment?.shipment_bag_reasons;
            setReasonsList(data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.log({ error });
      setIsLoading(false);
    }
  }

  function getInvoice(bagObj) {
    setIsLoading(true);
    try {
      fpi
        .executeGQL(SHIPMENT_INVOICE, bagObj)
        .then((res) => {
          if (res?.data?.shipment) {
            const data = res?.data?.shipment?.invoice_detail;
            setInvoiceDetails(data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
      console.log({ error });
    }
  }

  function updateShipment(payload, type) {
    setIsLoading(true);
    try {
      fpi
        .executeGQL(UPDATE_SHIPMENT_STATUS, payload)
        .then((res) => {
          if (
            res?.data?.updateShipmentStatus?.statuses[0]?.shipments[0]
              ?.status === 200
          ) {
            const newShipmentId =
              res?.data?.updateShipmentStatus?.statuses[0]?.shipments[0]
                ?.final_state?.shipment_id;
            if (type === "return") {
              showSnackbar(
                "Your return request has been accepted. Refunds will be processed in selected refund option within 7 days of return pickup.",
                "success"
              );
            }
            if (newShipmentId) {
              setTimeout(() => {
                if (newShipmentId) {
                  navigate(`/profile/orders/shipment/${newShipmentId}`);
                }
              }, 1000);
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
      console.log({ error });
    }
  }

  return {
    isLoading,
    shipmentDetails,
    invoiceDetails,
    reasonsList,
    getBagReasons,
    getInvoice,
    updateShipment,
  };
};

export default useShipmentDetails;
