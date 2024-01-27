<template>
  <v-container id="regular-tables" fluid tag="section">
    <v-row justify="space-between">
      <v-col cols="12" md="4">
        <v-form ref="form">
          <v-text-field v-model="model"
            :counter="max"
            :rules="rules"
            label="First name"
          ></v-text-field>
        </v-form>
      </v-col>

      <v-col cols="12" md="6" >
        <v-slider
          v-model="max"
          label="Max characters"
        >
        </v-slider>

        <v-checkbox
          v-model="allowSpaces"
          label="Allow spaces"
        ></v-checkbox>

        <v-text-field
          v-model="match"
          label="Value must match"
        ></v-text-field>
      </v-col>
    </v-row>
     <v-snackbar
      v-model="snackbar"
      :light="true"
      :top="true"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<<script>
export default {
  mounted() {
    // this.l/ist();
    // this.parseUrl();
  },
  watch: {
    $route(to, from) {
      this.parseUrl();
    },
    options: {
      handler() {
        this.list();
      },
      deep: true,
    },
  },
  methods: {
    parseUrl() {
      let type = this.$route.params.type;
      if (type) {
        switch (type) {
          case "add": {
            this.item.id = null;
            this.item.username = "";
            this.item.published = "1";
            this.dialog[type] = true;
            break;
          }
          case "detail":
          case "update": {
            let that = this;
            let id = this.$route.params.id;
            this.detail(id, function () {
              that.dialog[type] = true;
            });
            break;
          }
        }
      } else {
        this.dialog.add = false;
        this.dialog.detail = false;
        this.dialog.update = false;
      }
    },
    list(callback) {
      let $this = this;
      const { page, itemsPerPage } = this.options;
      let res = fetch(
        "/api/account?currentPage=" +
          page +
          "&pageSize=" +
          itemsPerPage
      )
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          $this.page.list = json.data.list;
          $this.page.total = json.data.totalCount;
        });
      if (callback) {
        res.then(callback);
      }
    },
    add() {
      this.$router.push("/account/account/add");
    },
    update(item) {
      this.$router.push("/account/account/update/" + item.id);
    },
    close() {
      this.$router.push("/account/account");
    },
    save() {
      let $this = this;
      let promise;
      $this.item.published=parseInt($this.item.published)
      if ($this.item.id) {
        promise = fetch("/api/account/" + $this.item.id, {
          method: "PUT",
          headers: {
            "Content-type": "application/json;",
          },
          body: JSON.stringify($this.item),
        });
      } else {
        $this.item.id = -1;
        promise = fetch("/api/account", {
          method: "POST",
          headers: {
            "Content-type": "application/json;",
          },
          body: JSON.stringify($this.item),
        });
      }
      promise
        .then(function () {
          $this.$router.push("/account/account");
        })
        .then($this.list);
    },
    del(item) {
      let $this = this;
      $this.item = item;
      this.dialog.delete = true;
    },
    delConfirm() {
      let $this = this;
      fetch("/api/account/" + $this.item.id, {
        method: "DELETE",
      })
      .then(function () {
        $this.dialog.delete = false;
      })
      .then($this.list);
    },
    detail(id, callback) {
      let $this = this;
      let prom = fetch("/api/account/" + id)
        .then((resp) =>  {return resp.json()})
        .then((json) => {
          $this.item = json.data;
          $this.item.published=$this.item.published+"";
        });
      if (callback) {
        prom.then(callback);
      }
    },
  },
  data() {
    return {
      snackbar: false,
      text: 'Hello, I\'m a snackbar',
      dialog: {
        add: false,
        detail: false,
        update: false,
        delete: false,
      },
      options: {},
      item: {
        id:0,
        username:"",
        description:"",
      },
      headers: [
        {
          text: "ID",
          value: "id",
          width: 70
        },
        { text: "用户名", value: "username", width: 200 },
        { text: "", value: "actions", sortable: false, width: 100 },
      ],
      page: {
        total: 0,
        list: [],
      },
    };
  },
};
</script>
