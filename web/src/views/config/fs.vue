<template>
  <v-container id="regular-tables" fluid tag="section">
    <base-material-card
      icon="mdi-clipboard-text"
      title="系统配置"
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
        <template v-slot:item.property="{ item }">
          <router-link :to="{ path: '/config/fs/detail/' + item.id }">{{
            item.property
          }}</router-link>
        </template>
        <template v-slot:item.amountType="{ item }">
          {{ amountTypeName(item.amountType) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="update(item)"> mdi-pencil </v-icon>
          <v-icon small @click="del(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </base-material-card>
    <v-dialog
      transition="dialog-top-transition"
      max-width="800"
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
                  label="属性"
                  v-model="item.property"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="值"
                  v-model="item.value"
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
      max-width="800"
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
                  label="属性"
                  v-model="item.property"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="值"
                  v-model="item.value"
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
      max-width="800"
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
                  label="属性"
                  v-model="item.property"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="值"
                  v-model="item.value"
                  readonly
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
    <v-snackbar v-model="snackbar" :light="true" :top="true">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<<script>
  import {webResult} from "@/net";
export default {
  mounted() {
    this.list();
    this.parseUrl();
  },
  watch: {
    $route(to, from) {
      this.parseUrl();
    },
  },
  methods: {
    parseUrl() {
      let type = this.$route.params.type;
      if (type) {
        switch (type) {
          case "add": {
            this.item.id = null;
            this.item.property = "";
            this.item.value = "";
            this.item.description = "";
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
        "/api/fs/config",{
            method: "GET",
            headers: {
              "Content-type": "application/json;",
              'X-Requested-With': 'fetch',
            }
          }
      )
      .then(webResult)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          $this.page.list = json.data;
          $this.page.total = json.data.length;
        });
      if (callback) {
        res.then(callback);
      }
    },
    add() {
      this.$router.push("/config/fs/add");
    },
    update(item) {
      this.$router.push("/config/fs/update/" + item.id);
    },
    close() {
      this.$router.push("/config/fs");
    },
    save() {
      let $this = this;
      let promise;
      debugger
      if ($this.item.id) {
        promise = fetch("/api/fs/config/" + $this.item.id, {
          method: "PUT",
          headers: {
            "Content-type": "application/json;",
          },
          body: JSON.stringify($this.item),
        });
      } else {
        $this.item.id = 0;
        promise = fetch("/api/fs/config", {
          method: "POST",
          headers: {
            "Content-type": "application/json;",
          },
          body: JSON.stringify($this.item),
        });
      }
      promise
      .then((resp) =>  {return resp.json()})
        .then(webResult)
        .then(function () {
          $this.$router.push("/config/fs");
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
      fetch("/api/config/" + $this.item.id, {
        method: "DELETE",
      })
      .then((resp) =>  {return resp.json()})
        .then(webResult)
        .then(function () {
          $this.dialog.delete = false;
        })
        .then($this.list);
    },
    detail(id, callback) {
      let $this = this;
      let prom = fetch("/api/fs/config/" + id)
        .then((resp) =>  {return resp.json()})
        .then(webResult)
        .then((data) => {
          $this.item = data;
        })
        .catch((e)=>{

        });
      if (callback) {
        prom.then(callback);
      }
    }
  },
  data() {
    return {
      snackbar: false,
      text: 'Hello, I\'m a snackbar',
      amountTimePickerAdd:false,
      amountTimePickerUpdate:false,
      dialog: {
        add: false,
        detail: false,
        update: false,
        delete: false,
      },
      options: {},
      item: {
        id:0,
        property:"",
        value:"",
        description:"",
      },
      headers: [
        { text: "property", value: "property", width: 50 },
        { text: "value", value: "value" , width: 150 },
        { text: "描述", value: "description"},
        { text: "", value: "actions", sortable: false, width: 80 },
      ],
      page: {
        total: 0,
        list: [],
      },
    };
  },
};
</script>
