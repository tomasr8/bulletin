import b1 from "./images/b1.png";
import b2 from "./images/b2.png";
import b3 from "./images/b3.png";
import b4 from "./images/b4.png";
import b5 from "./images/b5.png";
import b6 from "./images/b6.png";
import b7 from "./images/b7.png";

import styles from "./Cover.module.scss";

const images = [b1, b2, b3, b4, b5, b6, b7];
const dates = [
  "1965 - 1966",
  "1966 - 1968",
  "1968 - 1976",
  "1976 - 200?",
  "200? - 2014",
  "2014 - 2022",
  "2022 - ",
];

export default function Cover() {
  return (
    <div className={styles.wrapper}>
      {images.map((image, i) => (
        <div key={image} className="block">
          <div className={`box ${styles["image-wrapper"]}`}>
            <div>
              <span className="tag is-medium is-primary">{dates[i]}</span>
            </div>
            <img src={image} alt="" />
          </div>
        </div>
      ))}
    </div>
  );
}
