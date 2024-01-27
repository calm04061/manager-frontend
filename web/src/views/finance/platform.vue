<template>
  <v-container id="regular-tables" fluid tag="section">
    <base-material-card
      icon="mdi-clipboard-text"
      title="财务平台"
      class="px-5 py-3"
    >
      <template v-slot:action>
        <v-btn
          class="mx-2 v-btn--absolute.v-btn--bottom v-btn--bottom"
          fab
          dark
          @click="add"
          color="indigo"
        >
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
      </template>
      <v-data-table
        :headers="headers"
        :items="page.list"
        :items-per-page="5"
        :server-items-length="page.total"
        :options.sync="options"
        class="elevation-1"
      >
        <template v-slot:item.id="{ item }">
          <router-link :to="{ path: '/finance/platform/detail/' + item.id }">{{
            item.id
          }}</router-link>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="update(item)"> mdi-pencil </v-icon>
          <v-icon small @click="del(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </base-material-card>
    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      persistent
      v-model="dialog.add"
    >
      <v-card>
        <v-toolbar color="primary" dark>添加</v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="名称"
                  v-model="item.name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  solo
                  v-model="item.description"
                  name="input-7-4"
                  label="说明"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn @click="close">关闭</v-btn>
          <v-btn @click="save" color="success">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      persistent
      v-model="dialog.update"
    >
      <v-card>
        <v-toolbar color="primary" dark>修改:[{{ item.id }}]</v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="名称"
                  v-model="item.name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  solo
                  v-model="item.description"
                  name="input-7-4"
                  label="说明"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn @click="close">关闭</v-btn>
          <v-btn @click="save" color="success">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      persistent
      v-model="dialog.detail"
    >
      <v-card>
        <v-toolbar color="primary" dark>详情:[{{ item.id }}]</v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="名称"
                  v-model="item.name"
                  readonly
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  solo
                  v-model="item.description"
                  name="input-7-4"
                  label="说明"
                  readonly
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn @click="close">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      persistent
      v-model="dialog.delete"
    >
      <v-card>
        <v-card-text>
          <v-container> 你确定要删除{{ item.name }}? </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn @click="dialog.delete = false">关闭</v-btn>
          <v-btn @click="delConfirm" color="error">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

<script>
export default {
  created() {
    this.parseUrl();
  },
  mounted() {
    this.list();
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
            this.item.name = null;
            this.item.description = null;
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
        "/api/finance/platform?currentPage=" +
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
      this.$router.push("/finance/platform/add");
    },
    update(item) {
      this.$router.push("/finance/platform/update/" + item.id);
    },
    close() {
      this.$router.push("/finance/platform");
    },
    save() {
      let $this = this;
      let promise;
      if ($this.item.id) {
        promise = fetch("/api/finance/platform/" + $this.item.id, {
          method: "PUT",
          headers: {
            "Content-type": "application/json;",
          },
          body: JSON.stringify($this.item),
        });
      } else {
        $this.item.id = 0;
        promise = fetch("/api/finance/platform", {
          method: "POST",
          headers: {
            "Content-type": "application/json;",
          },
          body: JSON.stringify($this.item),
        });
      }
      promise
        .then((resp) =>  {return resp.json()})
        .then((json)=>{
          if(json.code==0){
            return json.data;
          }
          throw new Error(json.message);
        })
        .then(function () {
          $this.$router.push("/finance/platform");
        })
        .then($this.list)
        .catch((e)=>{
          $this.snackbar=true
          $this.text=e
        });
    },
    del(item) {
      let $this = this;
      $this.item = item;
      this.dialog.delete = true;
    },
    delConfirm() {
      let $this = this;
      fetch("/api/finance/platform/" + $this.item.id, {
        method: "DELETE",
      })
        .then(function () {
          $this.dialog.delete = false;
        })
        .then($this.list);
    },
    detail(id, callback) {
      let $this = this;
      let prom = fetch("/api/finance/platform/" + id)
        .then((resp) => {
          return resp.json();
        })
        .then((json) => {
          $this.item = json.data;
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
        id: 1,
        name: "",
        description: "",
      },
      headers: [
        {
          text: "ID",
          value: "id",
          width: 150,
        },
        { text: "名称", value: "name", width: 300 },
        { text: "说明", value: "description" },
        { text: "Actions", value: "actions", sortable: false, width: 100 },
      ],
      page: {
        total: 0,
        list: [],
      },
    };
  },
};
</script>
