import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import styles from "./styles/hyperlocal-tracking.less";
import RiderIcon from "../../assets/images/on-trip-bike.png";
import StoreIcon from "../../assets/images/store-marker.png";
import HomeIcon from "../../assets/images/home-marker.png";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
  DirectionsRenderer,
  Circle,
} from "@react-google-maps/api";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import { useGlobalStore } from "fdk-core/utils";
import { STORE_HYPERLOCAL } from "../../queries/logisticsQuery";
import { useThemeConfig } from "../../helper/hooks";

const HyperlocalTracking = ({ shipmentInfo }) => {
  const { pallete } = useThemeConfig({ fpi });
  // const INTEGRATION_TOKENS = useGlobalStore(fpi.getters.INTEGRATION_TOKENS);
  // const mapApiKey = Buffer?.from(
  //   INTEGRATION_TOKENS?.tokens?.google_map?.credentials?.api_key,
  //   "base64"
  // )?.toString();
  const mapApiKey = "AIzaSyAVCJQAKy6UfgFqZUNABAuGQp2BkGLhAgI";
  const [isLoading, setIsLoading] = useState(true);
  const [visibilityRadius] = useState(100);

  const [showMap, setShowMap] = useState(true);
  const [storeDetails, setStoreDetails] = useState(null);
  const shippingDetailsRef = useRef(null);
  const fetchShippingInterval = useRef(null);
  const [riderDetails, setRiderDetails] = useState(null);
  const [riderGeoLocation, setRiderGeoLocation] = useState(null);
  const fetchRiderInterval = useRef(null);
  const directionsService = useRef(null);
  const [mapDirections, setMapDirections] = useState(null);
  const [circleMarker, setCircleMarker] = useState(null);
  const [curvedPath, setCurvedPath] = useState(null);
  const mapRef = useRef(null);

  const [isRefreshRotating, setIsRefreshRotating] = useState(false);

  const shipmentId = shipmentInfo?.shipment_id;
  const isOrderDelivered = riderDetails?.status_code === "DL";
  const isOrderCancelled = riderDetails?.status_code === "CL";

  const fetchStoreDetails = () => {
    const payload = {
      locationId: shipmentInfo.fulfilling_store.id,
    };

    return fpi.executeGQL(STORE_HYPERLOCAL, payload).then((response) => {
      if (response?.errors) {
        throw response?.errors?.[0];
      }
      setStoreDetails(response.data.store);
      setIsLoading(false);
    });
  };

  const storeGeoLocation = useMemo(() => {
    const latLong = storeDetails?.address?.lat_long?.coordinates;
    if (latLong?.[0] && latLong?.[1]) {
      return {
        lat: latLong?.[1],
        lng: latLong?.[0],
      };
    }
    return {
      lat: 0,
      lng: 0,
    };
  }, [storeDetails]);

  const formattedStoreDetails = useMemo(() => {
    if (!storeDetails) {
      return null;
    }
    const { address1, address2, city } = storeDetails.address;
    const formattedAddress =
      (address1 ? `${address1}, ` : "") +
      (address2 ? `${address2}, ` : "") +
      (city || "");

    const { country_code, number } = storeDetails.manager.mobile_no;

    return {
      name: storeDetails.name,
      formattedAddress,
      managerContact: country_code ? `+${country_code} ${number}` : `${number}`,
    };
  }, [storeDetails]);

  const deliveryGeoLocation = useMemo(() => {
    if (
      shipmentInfo?.delivery_address?.latitude !== null &&
      shipmentInfo?.delivery_address?.longitude !== null
    ) {
      return {
        lat: shipmentInfo.delivery_address.latitude,
        lng: shipmentInfo.delivery_address.longitude,
      };
    }
    return null;
  }, [shipmentInfo]);

  const clearFetchRiderInterval = () => {
    if (fetchRiderInterval.current) {
      clearInterval(fetchRiderInterval.current);
      fetchRiderInterval.current = null;
    }
  };

  const clearFetchShippingInterval = () => {
    if (fetchShippingInterval.current) {
      clearInterval(fetchShippingInterval.current);
      fetchShippingInterval.current = null;
    }
  };

  const addCircleMarker = (source, destination) => {
    if (typeof window !== "undefined" && window.google) {
      const pointA = new window.google.maps.LatLng(source.lat, source.lng);
      const pointB = new window.google.maps.LatLng(
        destination.lat,
        destination.lng
      );

      const distanceInMeters =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          pointA,
          pointB
        );

      setCircleMarker(null);
      if (distanceInMeters <= visibilityRadius) {
        setCircleMarker(destination);
      }
    }
  };

  const fetchShippingDetails = useCallback(() => {
    if (shipmentInfo?.awb_no) {
      return fetch(
        `https://api.scm.fynd.com/tms/service/public/hyperlocal/v1.0/shipments/${shipmentInfo.awb_no}/tracking/details`,
        // `https://api.tmsz0.de/service/public/hyperlocal/v1.0/shipments/${this.shipmentBags.awb_no}/tracking/details`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((response) => {
          shippingDetailsRef.current = response;
          return response;
        });
    }

    return Promise.resolve();
  }, [shipmentInfo]);

  const fetchRiderDetails = useCallback(() => {
    const riderId = shippingDetailsRef?.current?.data?.rider_id;
    if (!riderId) return;
    fetch(
      `https://api.scm.fynd.com/tms/service/public/hyperlocal/v1.0/shipments/${shipmentInfo.awb_no}/tracking/live?rider_id=${riderId}&drop_latitude=${shipmentInfo.delivery_address.latitude}&drop_longitude=${shipmentInfo.delivery_address.longitude}`,
      // `https://api.tmsz0.de/service/public/hyperlocal/v1.0/shipments/${this.shipmentInfo.awb_no}/tracking/live?rider_id=${riderId}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((response) => {
        const { rider_details, ...restRiderDetails } = response?.data || {};
        const riderDetails = {
          ...restRiderDetails,
          ...(rider_details || {}),
        };
        setRiderDetails(riderDetails);

        if (riderDetails?.latitude && riderDetails?.longitude) {
          setRiderGeoLocation({
            lat: riderDetails.latitude,
            lng: riderDetails.longitude,
          });
        }

        if (riderDetails?.status_code === "OFD") {
          let dService = directionsService.current;
          if (!dService && typeof window !== "undefined" && window.google) {
            dService = new window.google.maps.DirectionsService();
            directionsService.current = dService;
          }

          const route = {
            origin: {
              lat: riderDetails.latitude,
              lng: riderDetails.longitude,
            },
            destination: deliveryGeoLocation,
            travelMode: "DRIVING",
            drivingOptions: {
              departureTime: new Date(),
              trafficModel: "bestguess",
            },
          };

          dService?.route(route, (directionResponse, status) => {
            // self.arrivalTime =
            //   directionResponse?.routes?.[0]?.legs?.[0]?.duration_in_traffic
            //     ?.value || null;

            if (status !== "OK") {
              setMapDirections(null);
              setCurvedPath([storeGeoLocation, deliveryGeoLocation]);
              console.error("Directions request failed due to " + status);
              return;
            } else {
              setCurvedPath(null);
              setMapDirections(directionResponse);
              addCircleMarker(
                {
                  lat: riderDetails.latitude,
                  lng: riderDetails.longitude,
                },
                deliveryGeoLocation
              );
            }
          });
        } else if (["DL", "CL"].includes(riderDetails?.status_code)) {
          clearFetchRiderInterval();
          setShowMap(false);
        } else {
          clearFetchRiderInterval();
          setCurvedPath([storeGeoLocation, deliveryGeoLocation]);
        }
      });
  }, [shipmentInfo, shippingDetailsRef.current]);

  const handleRefreshClick = async () => {
    setIsRefreshRotating(true);
    await fetchShippingDetails();
    setTimeout(() => {
      setIsRefreshRotating(false);
    }, 500);
  };

  const getDeliveredTime = useMemo(() => {
    if (riderDetails?.event_time) {
      const date = new Date(riderDetails?.event_time);
      const options = {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      return date.toLocaleString("en-US", options);
    }
    return "";
  }, [riderDetails]);

  const getArrivalTime = useMemo(() => {
    if (riderDetails?.duration) {
      const arrivingTimeInMin = Math.round(riderDetails?.duration / 60);
      if (arrivingTimeInMin === 0) {
        return "Arrived at your location";
      }
      return `Delivery in ${arrivingTimeInMin} Minute${arrivingTimeInMin > 1 ? "s" : ""}`;
    }

    if (shippingDetailsRef?.current?.data?.delivery_eta) {
      const deliveryETA = new Date(
        shippingDetailsRef?.current?.data?.delivery_eta
      );
      const options = {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      return `Delivery By ${deliveryETA.toLocaleString("en-US", options)}`;
    }

    if (shipmentInfo?.promise?.timestamp?.min) {
      return "We are processing your order";
    }

    return null;
  }, [riderDetails, shippingDetailsRef.current, shipmentInfo]);

  useEffect(() => {
    fetchStoreDetails();
    fetchShippingDetails();
    fetchShippingInterval.current = setInterval(fetchShippingDetails, 10000);
    return () => {
      clearInterval(fetchShippingInterval.current);
    };
  }, []);

  useEffect(() => {
    if (shippingDetailsRef?.current?.data?.rider_id) {
      clearFetchShippingInterval();
    }
    fetchRiderDetails();
    fetchRiderInterval.current = setInterval(fetchRiderDetails, 5000);
    return () => {
      clearInterval(fetchRiderInterval.current);
    };
  }, [shippingDetailsRef.current]);

  return (
    <div className={styles.mainContainer}>
      {showMap ? (
        <div className={styles.mapWrapper}>
          <div className={styles.googleMapContainer}>
            {!isLoading && (
              <LoadScript googleMapsApiKey={mapApiKey} libraries={["geometry"]}>
                <GoogleMap
                  mapContainerStyle={{
                    width: "100%",
                    height: "332px",
                  }}
                  center={storeGeoLocation}
                  zoom={14}
                  options={{
                    fullscreenControl: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                  }}
                  onLoad={(map) => {
                    mapRef.current = map;
                  }}
                >
                  {storeGeoLocation && (
                    <Marker
                      position={storeGeoLocation}
                      draggable={false}
                      icon={StoreIcon}
                    />
                  )}
                  {deliveryGeoLocation && (
                    <Marker
                      position={deliveryGeoLocation}
                      draggable={false}
                      icon={HomeIcon}
                    />
                  )}
                  {riderGeoLocation && (
                    <Marker
                      position={riderGeoLocation}
                      draggable={false}
                      icon={RiderIcon}
                    />
                  )}
                  {curvedPath && (
                    <Polyline
                      path={curvedPath}
                      options={{
                        geodesic: true,
                        strokeColor: pallete.button.button_primary,
                        strokeOpacity: 0,
                        strokeWeight: 1,
                        icons: [
                          {
                            icon: {
                              path: "M 0,-1 0,1",
                              strokeOpacity: 1,
                              scale: 4,
                            },
                            offset: "0",
                            repeat: "20px",
                          },
                        ],
                      }}
                    />
                  )}
                  {mapDirections && (
                    <DirectionsRenderer
                      directions={mapDirections}
                      options={{
                        suppressMarkers: true,
                        polylineOptions: {
                          strokeColor: pallete.button.button_primary,
                        },
                      }}
                    />
                  )}
                  {circleMarker && (
                    <Circle
                      center={circleMarker}
                      options={{
                        radius: visibilityRadius,
                        fillColor: "#f79834",
                        fillOpacity: 0.25,
                        strokeColor: "#f79834",
                        strokeOpacity: 0.7,
                        strokeWeight: 1,
                      }}
                    />
                  )}
                </GoogleMap>
              </LoadScript>
            )}
          </div>
          {getArrivalTime && (
            <div className={styles.trackingDetails}>
              <div className={styles.trackingDetailsTiming}>
                <div>
                  <p className={styles.timingLabel}>{getArrivalTime}</p>
                  <div className={styles.timingShipmentId}>
                    {`Shipment ID: ${shipmentId}`}
                  </div>
                </div>
                <p className={styles.timingStatus}>
                  {riderDetails?.display_name}
                </p>
              </div>
              <div
                className={`${styles.refreshIcon} ${isRefreshRotating ? styles.rotatingRefresh : ""}`}
                onClick={handleRefreshClick}
              >
                <SvgWrapper svgSrc="refresh" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.orderDelivered}>
          <div className={styles.deliveredIcon}>
            <SvgWrapper
              svgSrc={isOrderDelivered ? "checkmark-filled" : "cancelled"}
            />
          </div>
          <div>
            <p className={styles.deliveredInfoLabel}>
              {isOrderDelivered
                ? "Your order is delivered"
                : isOrderCancelled
                  ? "Order cancelled"
                  : "Something went wrong"}
            </p>
            {getDeliveredTime && (isOrderDelivered || isOrderCancelled) && (
              <p className={styles.deliveredInfoTime}>
                {`${isOrderDelivered ? "Delivered" : "Cancelled"} on: ${getDeliveredTime}`}
              </p>
            )}
          </div>
        </div>
      )}
      <div className={styles.contactDetails}>
        <div className={styles.contactDetailsItem}>
          <div className={styles.contactDetailsCard}>
            <div className={styles.cardLogo}>
              <SvgWrapper svgSrc="store-logo" />
            </div>
            {formattedStoreDetails && (
              <div className={styles.cardInfo}>
                <div className={styles.cardInfoName}>
                  {formattedStoreDetails.name}
                </div>
                <div className={styles.cardInfoAddress}>
                  {formattedStoreDetails.formattedAddress}
                </div>
              </div>
            )}
          </div>
          {formattedStoreDetails?.managerContact && (
            <a
              className={styles.contactDetailsContact}
              href={`tel:${formattedStoreDetails?.managerContact}`}
            >
              <SvgWrapper svgSrc="call" />
              <p className={styles.contactNumber}>
                {formattedStoreDetails?.managerContact}
              </p>
            </a>
          )}
        </div>
        {!isOrderDelivered && !isOrderCancelled && riderDetails?.name && (
          <div className={styles.contactDetailsItem}>
            <div className={styles.contactDetailsCard}>
              <div className={`${styles.cardLogo} ${styles.riderLogo}`}>
                <SvgWrapper svgSrc="rider-logo" />
              </div>
              <div className={styles.cardInfo}>
                <div className={styles.cardInfoName}>{riderDetails.name}</div>
                <div className={styles.cardInfoAddress}>
                  Your delivery partner
                </div>
              </div>
            </div>
            {riderDetails.contact_number && (
              <a
                className={styles.contactDetailsContact}
                href={`tel:${riderDetails.contact_number}`}
              >
                <SvgWrapper svgSrc="call" />
                <p className={styles.contactNumber}>
                  {riderDetails.contact_number}
                </p>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HyperlocalTracking;
