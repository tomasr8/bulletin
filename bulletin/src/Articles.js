import styles from "./Articles.module.scss";

export default function Article() {
  const data = `${process.env.PUBLIC_URL}/articles/1975_47.pdf`;

  return (
    <div className={styles.articles}>
      <div className="viewer">
        <object data={data} type="application/pdf">
          Failed to load PDF
        </object>
      </div>
    </div>
  );
}
