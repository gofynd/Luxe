import React from "react";
import CardLogo from "../card-logo/card-logo";
import Card from "../card/card";
import styles from "./card-list.less";

function CardList({ cardList, cardType, showOnlyLogo, globalConfig }) {
  return (
    <div className={styles.grpListWrap}>
      <div
        className={`${styles.groupCards} ${
          showOnlyLogo ? styles.logoOnlyGroup : ""
        }`}
        data-card={cardType}
      >
        {showOnlyLogo
          ? cardList.map((item, index) => (
              <CardLogo
                key={`group-item-logo${index}`}
                card={item}
                cardType={cardType}
                globalConfig={globalConfig}
              />
            ))
          : cardList?.map((item, index) => (
              <Card
                key={`${cardType}${index}`}
                card={item}
                cardType={cardType}
                globalConfig={globalConfig}
              />
            ))}
      </div>
    </div>
  );
}

export default CardList;
