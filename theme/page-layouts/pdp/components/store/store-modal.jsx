// StoreModal.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import StoreItem from "./store-item";
// eslint-disable-next-line import/no-unresolved
import styles from "./StoreModal.module.css"; // Import the module CSS file
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";

function StoreModal({
  isOpen,
  sellerData,
  activeStoreInfo,
  appFeatures,
  allStoresInfo,
  onCloseDialog,
}) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isViewMore, setIsViewMore] = useState(true);
  const pageSize = 4;

  const isDataLoading = allStoresInfo === null;
  const isSellerListing =
    !!appFeatures?.feature?.buybox?.is_seller_buybox_enabled;
  const availableCounts = `${allStoresInfo?.items?.length} ${
    isSellerListing ? "Seller" : "Store"
  }${allStoresInfo.items.length > 1 ? "s" : ""} Available`;

  const listingItems = allStoresInfo?.items || [];
  const getListingItems = isViewMore
    ? listingItems.slice(0, pageSize)
    : listingItems;
  const activeSortOption =
    allStoresInfo?.sort_on?.find((option) => option.is_selected)?.name || "";

  const closeSortDropdown = () => {
    setShowSortDropdown(false);
  };

  const loadMoreData = () => {
    if (allStoresInfo.page.has_next) {
      sellerData.loadMoreStores().then(() => {
        // Handle loading completion if needed
      });
    }
  };

  const selectionChange = (selected) => {
    // Handle store filter change
    // You can use this function to pass the selected value to the parent component
    // this.props.onStoreFilter(selected);
    closeSortDropdown();
  };

  const storeSelected = (activeStoreData, cart, isBuyNow) => {
    // Handle store item selection
    // You can use this function to pass the selected store info to the parent component
    // this.props.onStoreItemSelect(activeStoreData, cart, isBuyNow);
  };

  const onViewMore = () => {
    setIsViewMore(false);
  };

  const closeDialog = () => {
    onCloseDialog();
    closeSortDropdown();
  };

  return (
    <div>
      {isOpen && (
        <div className={`${styles.sidebarContainer} ${styles.fontBody}`}>
          <div className={styles.sidebarHeader}>
            <h3 className={`${styles.sellerLabel} ${styles.fontHeader}`}>
              {isSellerListing ? "Select Sellers" : "Select Stores"}
            </h3>
            <SvgWrapper
              svgSrc="sidebar-close"
              className={styles.closeIcon}
              onClick={closeDialog}
            />
          </div>

          <div className={styles.sidebarBody}>
            {isDataLoading ? (
              <fdk-loader className={styles.loaderWs} />
            ) : (
              <>
                <div
                  className={`${styles.sortWrapper} ${styles.closeSortDropdown}`}
                >
                  <button
                    type="button"
                    className={`${styles.sortButton} ${styles.flexAlignCenter} ${styles.justifyBetween} ${styles.fontBody}`}
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                  >
                    <p
                      className={`${styles.b1} ${styles.selectedOption}`}
                      title={activeSortOption}
                    >
                      {activeSortOption}
                    </p>
                    <SvgWrapper
                      svgSrc="arrow-down"
                      className={[
                        styles.dropdownArrow,
                        { [styles.rotateArrow]: showSortDropdown },
                      ]}
                    />
                  </button>
                  <ul
                    className={styles.sortDropdown}
                    style={{ display: showSortDropdown ? "block" : "none" }}
                  >
                    {allStoresInfo.sort_on.map((opt, index) => (
                      <li
                        key={index}
                        className={`${styles.b1} ${
                          opt.is_selected ? styles.selectedOption : ""
                        }`}
                      >
                        <button
                          onClick={() => selectionChange(opt.value)}
                          type="button"
                        >
                          {opt.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <h5 className={styles.storeCounts}>{availableCounts}</h5>

                <fdk-infinite-scrolling
                  onLoadMore={loadMoreData}
                  loadingData={false}
                >
                  <div className={styles.data}>
                    {getListingItems.map((item, index) => (
                      <StoreItem
                        key={index}
                        storeitem={item}
                        appFeatures={appFeatures}
                        activeStoreInfo={activeStoreInfo}
                        onSelectStoreItem={storeSelected}
                      />
                    ))}
                  </div>
                  {isViewMore && listingItems.length > pageSize && (
                    <div
                      className={`${styles.viewMoreWrapper} ${styles.flexCenter}`}
                    >
                      <button
                        type="button"
                        onClick={onViewMore}
                        className={styles.viewMoreBtn}
                      >
                        View More
                      </button>
                    </div>
                  )}
                </fdk-infinite-scrolling>
              </>
            )}
          </div>
        </div>
      )}
      {/* eslint-disable jsx-a11y/no-static-element-interactions */}
      {isOpen && (
        <div
          className={`${styles.overlay} ${styles.show}`}
          onClick={closeDialog}
        />
      )}
    </div>
  );
}

StoreModal.propTypes = {
  isOpen: PropTypes.bool,
  onCloseDialog: PropTypes.func,
};

export default StoreModal;
