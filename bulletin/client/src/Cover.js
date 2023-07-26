import b1 from "./images/b1.png";
import b2 from "./images/b2.png";
import b3 from "./images/b3.png";
import b4 from "./images/b4.png";
import b5 from "./images/b5.png";
import b6 from "./images/b6.png";
import b7 from "./images/b7.png";

import styles from "./Cover.module.scss";

const images = [b1, b2, b3, b4, b5, b6, b7];

export default function Cover() {
  return (
    <div className={styles.wrapper}>
      {images.map((image) => (
        <div key={image} className="block">
          <div className={`box ${styles["image-wrapper"]}`}>
            <div>
              <span className="tag is-medium is-primary">1965 - 1966</span>
            </div>
            <img src={image} alt="" />
          </div>
        </div>
      ))}
    </div>
  );
}
