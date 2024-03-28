import styles from "./Disclaimer.module.scss"

export default function Disclaimer() {
  return (
    <div className={styles.wrapper}>
      <div>
        This is a personal project not affiliated with CERN or the CERN
        Bulletin.
      </div>
      <div>
        The contents of this website are sourced from the{" "}
        <a href="https://cds.cern.ch" target="_blank" rel="noreferrer">
          CERN CDS
        </a>
        .
      </div>
    </div>
  )
}
