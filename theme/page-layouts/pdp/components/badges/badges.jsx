import React from "react";
import FyImage from "../../../../components/core/fy-image/fy-image";
import styles from "./badges.less";

function Badges({ pageConfig }) {
  const getBadgeData = () => {
    const badgeData = [];
    const totalBadges = 5;
    if (Object.keys(pageConfig).length) {
      for (let i = 1; i <= totalBadges; i += 1) {
        if (
          pageConfig?.[`badge_logo_${i}`] !== "" ||
          pageConfig?.[`badge_label_${i}`] !== ""
        ) {
          badgeData.push({
            logo: pageConfig?.[`badge_logo_${i}`],
            label: pageConfig?.[`badge_label_${i}`],
            url: pageConfig?.[`badge_url_${i}`],
          });
        }
      }
    }
    return badgeData;
  };

  return (
    <div className={styles.badgeWrapper}>
      {getBadgeData().map((badge, index) => (
        <div className={styles.badgeWrapper__item} key={index}>
          <div
            className={`${!badge.logo && styles["badgeWrapper__item--hide"]}`}
          >
            {badge.url ? (
              <a
                href={badge.url}
                className={styles.badgeWrapper__link}
                target="_blank"
                rel="noreferrer"
              >
                <FyImage
                  customClass={styles.badgeWrapper__logo}
                  src={badge.logo}
                  alt={badge.label}
                  sources={[{ width: 100 }]}
                />
              </a>
            ) : (
              <FyImage
                customClass={styles.badgeWrapper__logo}
                src={badge.logo}
                alt={badge.label}
                sources={[{ width: 100 }]}
              />
            )}
          </div>
          {badge?.label && (
            <div className={styles.badgeWrapper__label}>
              {badge.url ? (
                <a
                  href={badge.url}
                  className={`b2 ${styles.badgeWrapper__link}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {badge.label}
                </a>
              ) : (
                <p className={`b2 ${styles.badgeWrapper__text}`}>
                  {badge.label}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Badges;
