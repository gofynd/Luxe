import React from "react";
import { SectionRenderer } from "fdk-core/components";
import { useGlobalStore } from "fdk-core/utils";
import styles from "../styles/main.less";
import Loader from "../components/loader/loader";

function Home({ numberOfSections, fpi }) {
  const page = useGlobalStore(fpi.getters.PAGE) || {};
  const THEME = useGlobalStore(fpi.getters.THEME);
  const mode = THEME?.config?.list.find(
    (f) => f.name === THEME?.config?.current
  );
  const globalConfig = mode?.global_config?.custom?.props;
  const { sections = [], error, isLoading } = page || {};
  if (error) {
    return (
      <>
        <h1>Error Occured !</h1>
        <pre>{JSON.stringify(error, null, 4)}</pre>
      </>
    );
  }
  return (
    <div className={`${styles.basePageContainer} ${styles.margin0auto}`}>
      {!isLoading && (
        <SectionRenderer
          sections={sections}
          fpi={fpi}
          globalConfig={globalConfig}
        />
      )}
      {isLoading && <Loader></Loader>}
    </div>
  );
}

export const settings = JSON.stringify({
  props: [
    {
      id: "code",
      label: "Your Code Here",
      type: "code",
      default: "",
      info: "Add Your custom HTML Code below. You can also use the full screen icon to open a code editor and add your code",
    },
  ],
  blocks: [],
});

export const sections = JSON.stringify([
  {
    attributes: {
      page: "home",
    },
  },
]);

export default Home;
