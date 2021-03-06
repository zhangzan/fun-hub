const weekList = () => {
  return ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
};

let favoriteView = new Vue({
  el: "#app",
  name: "favorite",
  data: {
    list: [],
    favoriteList: localStorage.getItem("favoriteList")
      ? JSON.parse(localStorage.getItem("favoriteList"))
      : [],
    weekList: weekList(),
    weekDays: [[], [], [], [], [], [], []]
  },
  methods: {
    getData() {
      axios
        .get("/favorite/list", {
          params: {
            favoriteList: localStorage.getItem("favoriteList")
              ? JSON.parse(localStorage.getItem("favoriteList"))
              : []
          }
        })
        .then(({ status, data }) => {
          console.log(data);
          let count = 0;
          if (data.length) {
            this.list = this.list.concat(
              data.map(item => {
                item.isFavorite = this.favoriteList.includes(item.aid);
                this.weekDays[(moment(item.updated).day() + 6) % 7].push(item);
                return item;
              })
            );
          }
          // navView.videoCount = this.list.length;
          eventHub.$emit('update-video-count', this.list.length)
        });
    },
    removeFromFavoriteList(item) {
      let index = this.favoriteList.findIndex((d) => {
        return d.aid === item.aid;
      });

      this.favoriteList.splice(index, 1);
      localStorage.setItem("favoriteList", JSON.stringify(this.favoriteList));

      index = this.list.findIndex((d) => {
        return d.aid === item.aid;
      });

      this.list.splice(index, 1);
    },
    removeFromWeekArray({ aid }, index) {
      console.log(index);
      let removeIndex = this.weekDays[index].findIndex(
        item => item.aid === aid
      );
      this.weekDays[index].splice(removeIndex, 1);
      removeIndex = this.favoriteList.findIndex(item => item === aid);
      this.favoriteList.splice(removeIndex, 1);
      localStorage.setItem("favoriteList", JSON.stringify(this.favoriteList));
    }
  },
  mounted() {
    this.getData();
  }
});
