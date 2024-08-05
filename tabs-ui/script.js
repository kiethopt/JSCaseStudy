const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const tabs = $$(".tab-item");
const panels = $$(".tab-panel");

const tabActive = $(".tab-item.active");
const line = $(".tabs .line");

line.style.left = tabActive.offsetLeft + "px"; // Vị trí bên trái
line.style.width = tabActive.offsetWidth + "px"; // Chiều rộng

tabs.forEach((tab, index) => {
  const panel = panels[index];

  tab.onclick = function () {
    // Trước khi add thì tìm item nào có active thì remove
    $(".tab-item.active").classList.remove("active");
    $(".tab-panel.active").classList.remove("active");

    line.style.left = this.offsetLeft + "px"; // Vị trí bên trái
    line.style.width = this.offsetWidth + "px"; // Chiều rộng

    // Sau đó thêm class active vào item được click
    this.classList.add("active"); // bấm vào item nào thì tự thêm class active
    panel.classList.add("active");
  };
});
