/* eslint-disable no-undef */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { isRunningOnClient } from "../helper/utils";
import styles from "../styles/sections/hero-video.less";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import IntersectionObserverComponent from "../components/intersection-observer/intersection-observer";

export function Component({ props, globalConfig }) {
  const {
    videoFile,
    videoUrl,
    autoplay,
    hidecontrols,
    showloop,
    title,
    coverUrl,
  } = props;

  const [isMobile, setIsMobile] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [defaultIcon, setDefaultIcon] = useState(
    !!(videoFile?.value || videoUrl?.value)
  );
  const videoRef = useRef(null);
  const ytVideoRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(
    isRunningOnClient() ? window?.innerWidth : 400
  );

  useEffect(() => {
    if (isRunningOnClient()) {
      const localDetectMobileWidth = () =>
        document?.getElementsByTagName("body")?.[0]?.getBoundingClientRect()
          ?.width <= 768;

      const handleResize = () => {
        setWindowWidth(window?.innerWidth);
        setIsMobile(localDetectMobileWidth());
      };

      window?.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
    if (autoplay?.value) {
      setShowOverlay(false);
    }
  }, []);

  function isGdrive() {
    const urlObj = new URL(videoUrl?.value);
    return urlObj.host.includes("drive.google.com");
  }

  function getGdriveVideoUrl() {
    if (videoUrl) {
      const urlObj = new URL(videoUrl?.value);
      const v = urlObj.pathname.split("/");
      const fileId = v[v.indexOf("d") + 1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    return "";
  }

  function getVideoSource() {
    if (videoFile?.value) {
      return videoFile?.value;
    }
    if (isGdrive()) {
      return getGdriveVideoUrl();
    }
    return videoUrl?.value;
  }

  function playMp4() {
    setShowOverlay(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
  }

  function stopMp4() {
    setShowOverlay(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }

  function getYTVideoID() {
    const urlObj = new URL(videoUrl?.value);
    const { searchParams } = urlObj;
    let v = searchParams.get("v");
    if (urlObj.host.includes("youtu.be")) {
      v = urlObj.pathname.split("/").pop();
    }
    return v;
  }

  const isYoutube = useCallback(() => {
    if (!videoUrl?.value) {
      return false;
    }
    const urlObj = new URL(videoUrl?.value);
    if (
      urlObj.host.includes("youtu.be") ||
      urlObj.host.includes("youtube.com")
    ) {
      return true;
    }
    return false;
  }, [videoUrl?.value]);

  const onYouTubeIframeAPIReady = () => {
    const ytVideo = ytVideoRef.current;
    window.players = { ...window.players };
    const { players } = window;

    if (ytVideo) {
      const videoID = ytVideo.dataset.videoid;
      if (!players[videoID]) {
        players[videoID] = {};
      }

      const videoMeta = JSON.parse(ytVideo.dataset.videometa);
      const qautoplay = videoMeta?.autoplay?.value ? 1 : 0;
      const qcontrols = videoMeta?.hidecontrols?.value ? 0 : 1;
      const qmute = videoMeta?.autoplay?.value;
      const qloop = videoMeta?.showloop?.value ? 0 : 1;

      players[videoID].onReady = (e) => {
        if (qmute) {
          e.target.mute();
        }
        if (qautoplay) {
          e.target.playVideo();
        }
        setIsLoading(false);
      };

      players[videoID].onStateChange = (event) => {
        const p = window.players;
        if (
          event.data === YT.PlayerState.PLAYING ||
          event.data === YT.PlayerState.BUFFERING
        ) {
          setShowOverlay(false);
        }
        if (event.data === YT.PlayerState.PAUSED) {
          setShowOverlay(true);
        }
        if (event.data === YT.PlayerState.ENDED) {
          if (qloop === true) {
            setShowOverlay(true);
          } else {
            p[videoID].inst.playVideo();
            p[videoID].inst.seekTo(0);
          }
        }
      };

      /* eslint-disable react/no-unknown-property */
      players[videoID].inst = new YT.Player(`yt-video-${videoID}`, {
        videoId: videoID,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: qautoplay,
          controls: qcontrols,
          modestbranding: 1,
          mute: qmute,
          loop: qloop,
          fs: 0,
          WebKitPlaysInline: "true",
          playsinline: 1,
          cc_load_policty: 0,
          iv_load_policy: 3,
          origin: document.location.origin,
        },
        events: {
          onReady: players[videoID].onReady,
          onStateChange: players[videoID].onStateChange,
        },
      });
    }
  };

  const loadYTScript = useCallback(() => {
    const nodes = document.querySelectorAll("[data-ytscript]");
    if (nodes.length === 0) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.dataset.ytscript = "true";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      tag.onload = () => {
        if (!window.onYouTubeIframeAPIReady) {
          window.onYouTubeIframeAPIReady = () => {
            setTimeout(onYouTubeIframeAPIReady, 500);
          };
        } else {
          setTimeout(onYouTubeIframeAPIReady, 500);
        }
      };
    } else if (!window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady = () => {
        setTimeout(onYouTubeIframeAPIReady, 500);
      };
    } else {
      setTimeout(onYouTubeIframeAPIReady, 500);
    }
    setIsLoading(true);
  }, []);

  const removeYTScript = () => {
    const { players } = window;
    if (players) {
      Object.keys(players).forEach((item) => {
        if (players[item].inst) players[item].inst.destroy();
      });
      window.players = null;
    }
    const nodes = document.querySelectorAll("[data-ytscript]");
    if (nodes.length > 0) {
      nodes.forEach((element) => {
        element.parentNode.removeChild(element);
      });
    }
    if (typeof YT !== "undefined") {
      window.YT = undefined;
    }
  };

  const playYT = () => {
    const videoID = ytVideoRef.current.dataset.videoid;
    const p = window.players;
    p[videoID].inst.playVideo();
    setShowOverlay(false);
  };

  const stopYT = () => {
    const videoID = ytVideoRef.current.dataset.videoid;
    const p = window.players;
    p[videoID].inst.pauseVideo();
    setShowOverlay(true);
  };

  const closeVideo = () => {
    if (videoFile?.value || isGdrive()) {
      stopMp4();
    } else {
      stopYT();
    }
  };

  const playVideo = () => {
    if (videoFile?.value || isGdrive()) {
      playMp4();
    } else {
      playYT();
    }
  };

  useEffect(() => {
    // setShowOverlay(autoplay?.value)
    if (isYoutube(videoUrl?.value)) {
      removeYTScript();
    }

    setTimeout(() => {
      if (isYoutube(videoUrl?.value)) {
        loadYTScript();
      }
    }, 0);
  }, [props, isYoutube, loadYTScript, videoUrl?.value]);

  const phoneClick = () => {
    if (window.innerWidth < 800 && !showOverlay) {
      closeVideo();
    }
  };

  const dynamicStyles = {
    "--margin_bottom": `${globalConfig.section_margin_bottom}px`,
  };
  return (
    <div style={dynamicStyles}>
      {title?.value && (
        <h2 className={`${styles.video_heading} fontHeader`}>{title?.value}</h2>
      )}
      <div className={`${styles.video_container}`} onClick={phoneClick}>
        <IntersectionObserverComponent>
          {
            videoFile?.value ? (
              <video
                ref={videoRef}
                width="100%"
                poster={coverUrl?.value?.replace("original", "resize-w:900")}
                autoPlay={autoplay?.value}
                muted={autoplay?.value}
                loop={showloop?.value}
                controls={!hidecontrols?.value}
                webkitPlaysInline="true"
                playsInline
                onPause={() => setShowOverlay(true)}
                onEnded={() => setShowOverlay(true)}
                onPlay={() => setShowOverlay(false)}
                onLoadedData={() => setIsLoading(false)}
                onProgress={() => setIsLoading(false)}
                preload="auto"
                src={getVideoSource()}
                allowFullScreen
              />
            ) : (
              isYoutube() && (
                //  <div
                //           className={styles["yt_container"]}
                //           allowFullScreen
                //         >

                /* eslint-disable react/no-unknown-property */
                <div
                  className={styles.yt_video}
                  ref={ytVideoRef}
                  id={`yt-video-${getYTVideoID(videoUrl?.value)}`}
                  data-videoid={getYTVideoID(videoUrl?.value)}
                  data-videometa={JSON.stringify(props)}
                  allowFullScreen
                />
              )
            )
            // </div>
          }

          {showOverlay && (
            <div
              className={`overlay animated fadein overlay-noimage:${coverUrl?.value} youtube-noimage: ${isYoutube()}`}
            >
              {coverUrl.value && (
                <div
                  className={styles.overlay__image}
                  style={{
                    background: `#ccc url(${coverUrl?.value}) center/cover no-repeat `,
                  }}
                />
              )}
              <div className={styles.overlay__content}>
                <button
                  id="play"
                  onClick={playVideo}
                  className={styles.overlay__playButton}
                  aria-label="Play Video"
                  type="button"
                >
                  <SvgWrapper svgSrc="play" />
                </button>
              </div>
            </div>
          )}
        </IntersectionObserverComponent>
        {!showOverlay && (
          <button
            className={styles.pauseButton}
            style={{ display: !defaultIcon && "block" }}
            onClick={closeVideo}
            aria-label="Pause Video"
            type="button"
          >
            <SvgWrapper svgSrc="pause" />
          </button>
        )}
      </div>
    </div>
  );
}

export const settings = {
  label: "Hero Video",
  props: [
    {
      type: "video",
      id: "videoFile",
      default: false,
      label: "Primary Video",
    },
    {
      id: "videoUrl",
      type: "text",
      label: "Video URL",
      default: "",
      info: "Supports MP4 Video & Youtube Video URL",
    },
    {
      type: "checkbox",
      id: "autoplay",
      default: true,
      label: "Autoplay",
      info: "Check to enable autoplay (Video will be muted if autoplay is active)",
    },
    {
      type: "checkbox",
      id: "hidecontrols",
      default: true,
      label: "Hide Video Controls",
      info: "check to disable video controls",
    },
    {
      type: "checkbox",
      id: "showloop",
      default: "true",
      label: "Play Video in Loop",
      info: "check to disable Loop",
    },
    {
      type: "text",
      id: "title",
      default: "Put Your Video Section Heading Here",
      label: "Heading",
    },
    {
      id: "coverUrl",
      type: "image_picker",
      label: "Thumbnail Image",
      default: "",
      options: {
        aspect_ratio: "16:9",
        aspect_ratio_strict_check: true,
      },
    },
  ],
};
