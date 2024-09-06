import React from "react";
import View3D from "@egjs/react-view3d";
import Loader from "../../../../components/loader/loader";
import styles from "./viewer-3d.less";

function Viewer3D({ src, prompt, autoRotate, children }) {
  return (
    <View3D
      src={src}
      autoplay={autoRotate}
      initialZoom={15}
      className={styles.canvasClass}
    >
      {children}
    </View3D>
  );
}

export default Viewer3D;
