export default function Disclaimer() {
  return (
    <div class="modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Modal title</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          The copyright to the CERN Bulletin issues is owned by the European
          Organization for Nuclear Research (CERN) and is protected under
          applicable intellectual property laws.
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success">Save changes</button>
          <button class="button">Cancel</button>
        </footer>
      </div>
    </div>
  );
}
