<template>
  <v-container id="regular-tables" fluid tag="section">
    <base-material-card
      icon="mdi-clipboard-text"
      title="平台账号"
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
          <v-icon dark> mdi-plus</v-icon>
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
          <router-link :to="{ path: '/finance/account/detail/' + item.id }">{{
              item.id
            }}
          </router-link>
        </template>
        <template v-slot:item.enabled="{ item }">
          <v-switch
            v-model="item.enabled"
            @change="enabled(item)"
            :false-value=false
            :true-value=true
          ></v-switch>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="update(item)"> mdi-pencil</v-icon>
          <v-icon small @click="del(item)"> mdi-delete</v-icon>
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
              <v-col cols="6">
                <v-select
                  :items="members"
                  label="成员"
                  item-text="name"
                  item-value="id"
                  v-model="item.memberId"
                  @change="onMemberChange"
                  required
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  :items="platforms"
                  label="平台"
                  item-text="name"
                  item-value="id"
                  v-model="item.platformId"
                  @change="onPlatformChange"
                  required
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  label="上级"
                  v-model="item.parentId"
                  item-value="id"
                  item-text="account"
                  :items="parents"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="账号"
                  v-model="item.account"
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
              <v-col cols="6">
                <v-select
                  :items="members"
                  label="账户"
                  item-text="name"
                  item-value="id"
                  v-model="item.memberId"
                  required
                  onchange="onMemberChange"

                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  :items="platforms"
                  label="平台"
                  item-text="name"
                  item-value="id"
                  v-model="item.platformId"
                  onchange="onPlatformChange"
                  required
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  label="上级"
                  v-model="item.parentId"
                  item-value="id"
                  item-text="account"
                  :items="parents"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="账号"
                  v-model="item.account"
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
              <v-col cols="6">
                <v-select
                  :items="members"
                  item-text="name"
                  item-value="id"
                  label="会员"
                  v-model="item.memberId"
                  readonly
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  :items="platforms"
                  item-text="name"
                  item-value="id"
                  label="平台"
                  v-model="item.platformId"
                  readonly
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  label="上级"
                  v-model="item.parentId"
                  item-value="id"
                  item-text="account"
                  :items="parents"
                  readonly
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="账号"
                  v-model="item.account"
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
          <v-container>
            你确定要删除【{{ item.platformName }}】的{{ item.account }}?
          </v-container>
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

<
<script>

export default {
  mounted() {
    this.listPlatform()
    this.listMember()
    this.list();
    this.parseUrl();
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
    "item.platformId":{
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.listTopParent(this.item.memberId, val);
        }
      },
      deep: true,
    } ,
    "item.memberId":{
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.listTopParent(val);
        }
      },
      deep: true,
    }
  },
  methods: {
    parseUrl() {
      let type = this.$route.params.type;
      if (type) {
        switch (type) {
          case "add": {
            let that = this;
            that.item.id = null;
            that.item.account = "";
            that.item.platformId = null;
            that.item.memberId = null;
            that.item.description = "";
            that.dialog[type] = true;
            break;
          }
          case "detail":
          case "update": {
            let that = this;
            let id = this.$route.params.id;
            that.detail(id, function (a) {
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
    onPlatformChange(e){
      console.log(1)
    },
    onMemberChange(e){
      console.log(1)
    },
    listTopParent(memberId, platformId, callback) {
      let query =[];
      if (memberId && platformId){
        query.push("memberId=" + memberId);
        query.push("platformId=" + platformId);
      }else{
        return;
      }
      let $this = this;
      query =  query.join("&");
      let res = fetch("/api/finance/account/0/children?"+query)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          $this.parents = json.data;
          if ($this.parents.length ===0) {
            $this.parents.push({
              id: -1,
              account: "无上级",
            });
          }
        });
      if (callback) {
        res.then(callback);
      }
    },
    list(callback) {
      let $this = this;
      const {page, itemsPerPage} = this.options;
      let res = fetch(
        "/api/finance/account?currentPage=" +
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
      this.$router.push("/finance/account/add");
    },
    update(item) {
      this.$router.push("/finance/account/update/" + item.id);
    },
    close() {
      this.$router.push("/finance/account");
    },
    save() {
      let $this = this;
      let promise;
      if ($this.item.id) {
        promise = fetch("/api/finance/account/" + $this.item.id, {
          method: "PUT",
          headers: {
            "Content-type": "application/json;",
          },
          body: JSON.stringify($this.item),
        });
      } else {
        $this.item.id = -1;
        promise = fetch("/api/finance/account", {
          method: "POST",
          headers: {
            "Content-type": "application/json;",
          },
          body: JSON.stringify($this.item),
        });
      }
      promise
        .then(function () {
          let current = $this.$router.history.current.fullPath;
          if(current!=="/finance/account"){
            $this.$router.push("/finance/account");
          }
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
      fetch("/api/finance/account/" + $this.item.id, {
        method: "DELETE",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then(function () {
          $this.dialog.delete = false;
        })
        .then($this.list);
    },
    detail(id, callback) {
      let $this = this;
      let prom = fetch("/api/finance/account/" + id, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((resp) => {
          return resp.json()
        })
        .then((json) => {
          $this.item = json.data;
        });
      if (callback) {
        prom.then(callback);
      }
    },
    listPlatform() {
      let $this = this;
      fetch("/api/finance/platform/list", {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      }).then((res) => {
        return res.json()
      })
        .then(json => {
          $this.platforms = json.data;
        })
    },
    listMember() {
      let $this = this;
      fetch("/api/member/list", {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      }).then((res) => {
        return res.json()
      })
        .then(json => {
          $this.members = json.data;
        })
    },
    enabled(item){
      let $this = this;
      $this.item = item;
      $this.save();
    }
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
        id: 0,
        account: "",
        platformId: 0,
        memberId: 0,
        description: "",
        parentId: null,
        enabled: null,
      },
      platforms: [],
      members: [],
      headers: [
        {
          text: "ID",
          value: "id",
          width: 60
        },
        {text: "成员", value: "memberName", width: 90},
        {text: "平台", value: "platformName", width: 130},
        {text: "账号", value: "account", width: 150},
        {text: "父账号", value: "parentName", width: 150},
        {text: "启用", value: "enabled", width: 90},
        {text: "说明", value: "description"},
        {text: "", value: "actions", sortable: false, width: 100},
      ],
      parents: [],
      page: {
        total: 0,
        list: [],
      },
    };
  },
};
</script>
