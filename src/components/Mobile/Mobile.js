import styles from "./Mobile.module.scss";
import clsx from "clsx";
const Mobile = () => {
  return (
    <div
      className={clsx(
        styles["mobile-page-container"],
        "d-flex justify-content-center align-items-center c-font"
      )}
    >
      Please view it on the Desktop
    </div>
  );
};
export default Mobile;
