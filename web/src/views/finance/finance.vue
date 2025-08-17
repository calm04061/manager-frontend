<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      title="流水记录"
      class="px-5 py-3"
    >
      <v-row>
        <v-col cols="4">
          <v-select
            v-model="query.memberId"
            :items="members"
            label="成员"
            item-text="name"
            item-value="id"
            clearable
          />
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="query.platformId"
            :items="platforms"
            label="平台"
            item-text="name"
            item-value="id"
            clearable
          />
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="query.accountId"
            :items="accounts"
            label="账户"
            item-text="account"
            item-value="id"
            clearable
          />
        </v-col>
      </v-row>
      <template #action>
        <v-btn
          class="mx-2 v-btn--absolute.v-btn--bottom v-btn--bottom"
          fab
          dark
          color="indigo"
          @click="add"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
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
        <template #item.id="{ item }">
          <router-link :to="{ path: '/finance/finance/detail/' + item.id }">
            {{
              item.id
            }}
          </router-link>
        </template>
        <template #item.amountType="{ item }">
          {{ amountTypeName(item.amountType) }}
        </template>
        <template #item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="update(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="del(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </base-material-card>
    <v-dialog
      v-model="dialog.add"
      transition="dialog-top-transition"
      max-width="800"
      scrollable
      persistent
    >
      <v-card>
        <v-toolbar
          color="primary"
          dark
        >
          添加
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="item.memberId"
                  :items="members"
                  label="成员"
                  item-text="name"
                  item-value="id"
                  required
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="item.platformId"
                  :items="platforms"
                  label="平台"
                  item-text="name"
                  item-value="id"
                  required
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="item.amountType"
                  :items="amountTypes"
                  label="类型"
                  required
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="item.accountId"
                  :items="accounts"
                  item-text="account"
                  item-value="id"
                  label="账号"
                  required
                />
              </v-col>
              <v-col cols="6">
                <v-menu
                  v-model="amountTimePickerAdd"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      :value="item.amountTime"
                      label="时间"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @click:clear="item.amountTime = null"
                    />
                  </template>
                  <v-date-picker
                    v-model="item.amountTime"
                    @change="amountTimePickerAdd = false"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.amount"
                  label="金额"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="item.description"
                  solo
                  name="input-7-4"
                  label="说明"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn @click="close">
            关闭
          </v-btn>
          <v-btn
            color="success"
            @click="save"
          >
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog.update"
      transition="dialog-top-transition"
      max-width="800"
      scrollable
      persistent
    >
      <v-card>
        <v-toolbar
          color="primary"
          dark
        >
          修改:[{{ item.id }}]
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="item.memberId"
                  :items="members"
                  label="成员"
                  item-text="name"
                  item-value="id"
                  required
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="item.platformId"
                  :items="platforms"
                  label="平台"
                  item-text="name"
                  item-value="id"
                  required
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="item.accountId"
                  :items="accounts"
                  item-text="account"
                  item-value="id"
                  label="账号"
                  required
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="item.amountType"
                  :items="amountTypes"
                  label="类型"
                  required
                />
              </v-col>
              <v-col cols="6">
                <v-menu
                  v-model="amountTimePickerUpdate"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      :value="item.amountTime"
                      label="时间"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @click:clear="item.amountTime = null"
                    />
                  </template>
                  <v-date-picker
                    v-model="item.amountTime"
                    @change="amountTimePickerUpdate = false"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.amount"
                  label="金额"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="item.description"
                  solo
                  name="input-7-4"
                  label="说明"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn @click="close">
            关闭
          </v-btn>
          <v-btn
            color="success"
            @click="save"
          >
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog.detail"
      transition="dialog-top-transition"
      max-width="800"
      scrollable
      persistent
    >
      <v-card>
        <v-toolbar
          color="primary"
          dark
        >
          详情:[{{ item.id }}]
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="item.amount"
                  label="金额"
                  readonly
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="item.amountType"
                  :items="amountTypes"
                  label="类型"
                  readonly
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.amountTime"
                  label="时间"
                  readonly
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="item.platformId"
                  :items="platforms"
                  item-text="name"
                  item-value="id"
                  label="平台"
                  readonly
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="item.accountId"
                  :items="accounts"
                  item-text="account"
                  item-value="id"
                  label="账号"
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="item.description"
                  solo
                  name="input-7-4"
                  label="说明"
                  readonly
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn @click="close">
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog.delete"
      transition="dialog-top-transition"
      max-width="600"
      persistent
    >
      <v-card>
        <v-card-text>
          <v-container> 你确定要删除{{ item.name }}?</v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn @click="dialog.delete = false">
            关闭
          </v-btn>
          <v-btn
            color="error"
            @click="delConfirm"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :light="true"
      :top="true"
    >
      {{ text }}

      <template #action="{ attrs }">
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
import {financeLastDetail, listAccount, listMember, listPlatform, pageFinances} from '@/service/api'

export default {
  data() {
    return {
      snackbar: false,
      text: 'Hello, I\'m a snackbar',
      amountTimePickerAdd: false,
      amountTimePickerUpdate: false,
      dialog: {
        add: false,
        detail: false,
        update: false,
        delete: false,
      },
      query: {
        platformId: null,
        memberId: null,
        accountId: null,
      },
      options: {},
      item: {
        id: 0,
        amount: "0",
        amountType: 0,
        amountTime: 0,
        platformId: 0,
        memberId: 0,
        accountId: 0,
        description: '',
      },
      platforms: [],
      members: [],
      accounts: [],
      amountTypes: [{
        value: 1,
        text: '支出',
      }, {
        value: 2,
        text: '收入',
      }, {
        value: 3,
        text: '余额',
      }],
      headers: [
        {
          text: 'ID',
          value: 'id',
          width: 70,
        },
        {text: '金额', value: 'amount', width: 100},
        {text: '类型', value: 'amountType', width: 100},
        {text: '平台', value: 'platformName', width: 100},
        {text: '账号', value: 'account', width: 150},
        {text: '说明', value: 'description'},
        {text: '记账时间', value: 'amountTime', width: 120},
        {text: '', value: 'actions', sortable: false, width: 80},
      ],
      page: {
        total: 0,
        list: [],
      },
    }
  },
  watch: {
    $route(to, from) {
      this.parseUrl()
    },
    options: {
      handler() {
        this.list()
      },
      deep: true,
    },
    'query.platformId': {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.listAccount(this.query.memberId, val, this.list)
        }
      },
      deep: true,
    },
    'query.memberId': {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.listAccount(val, this.query.platformId, this.list)
        }
      },
      deep: true,
    },
    'query.accountId': {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.list()
        }
      },
      deep: true,
    },
    'item.accountId': {
      handler(val, oldVal) {
        if (this.item.amount > 0) {
          return
        }
        const $this = this
        financeLastDetail($this.item.platformId, $this.item.amountType, val).then(data => {
          if (data) {
            $this.item.amount = data.amount
          }
        });
      },
      deep: true,
    },
    'item.platformId': {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.listAccount(this.item.memberId, val)
        }
      },
      deep: true,
    },
    'item.memberId': {
      handler(val, oldVal) {
        if (val !== oldVal) {
          debugger
          this.listAccount(val, this.item.platformId)
        }
      },
      deep: true,
    }
  },
  mounted() {
    this.listPlatform();
    this.listMember();
    this.parseUrl();
  },
  methods: {
    parseUrl() {
      const type = this.$route.params.type
      if (type) {
        switch (type) {
          case 'add': {
            this.item.id = null
            this.item.amount = null
            this.item.amountType = null
            this.item.amountTime = null
            this.item.platformId = null
            this.item.description = ''
            this.dialog[type] = true
            break
          }
          case 'detail':
          case 'update': {
            const that = this
            const id = this.$route.params.id
            this.detail(id, function () {
              that.dialog[type] = true
            })
            break
          }
        }
      } else {
        this.dialog.add = false
        this.dialog.detail = false
        this.dialog.update = false
      }
    },
    list(callback) {
      const $this = this
      const {page, itemsPerPage} = this.options
      const res = pageFinances(page, itemsPerPage, $this.query)
        .then((json) => {
          $this.page.list = json.data.list
          $this.page.total = json.data.totalCount
        })
      if (callback) {
        res.then(callback)
      }
    },
    add() {
      this.$router.push('/finance/finance/add')
    },
    update(item) {
      this.$router.push('/finance/finance/update/' + item.id)
    },
    close() {
      this.$router.push('/finance/finance')
    },
    save() {
      const $this = this
      let promise
      if ($this.item.id) {
        promise = fetch('/api/finance/finance/' + $this.item.id, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json;',
          },
          body: JSON.stringify($this.item),
        })
      } else {
        $this.item.id = 0
        promise = fetch('/api/finance/finance', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json;',
          },
          body: JSON.stringify($this.item),
        })
      }
      promise
        .then((resp) => {
          return resp.json()
        })
        .then($this.webResult)
        .then(function () {
          $this.$router.push('/finance/finance')
        })
        .then($this.list)
    },
    del(item) {
      const $this = this
      $this.item = item
      this.dialog.delete = true
    },
    delConfirm() {
      const $this = this
      fetch('/api/finance/finance/' + $this.item.id, {
        method: 'DELETE',
      })
        .then((resp) => {
          return resp.json()
        })
        .then($this.webResult)
        .then(function () {
          $this.dialog.delete = false
        })
        .then($this.list)
    },
    detail(id, callback) {
      const $this = this
      const prom = fetch('/api/finance/finance/' + id)
        .then((resp) => {
          return resp.json()
        })
        .then($this.webResult)
        .then((data) => {
          $this.item = data
        })
        .catch((e) => {

        })
      if (callback) {
        prom.then(callback)
      }
    },
    listPlatform() {
      const $this = this
      listPlatform().then(data => {
        $this.platforms = data
      })
    },
    listAccount(memberId, platformId, callback) {
      const $this = this
      debugger
      listAccount(memberId, platformId).then(data => {
        $this.accounts = data
      });
      $this.query.accountId = null
      if (callback) {
        callback()
      }
    },
    amountTypeName(type) {
      for (const i in this.amountTypes) {
        if (this.amountTypes[i].value === type) {
          return this.amountTypes[i].text
        }
      }
      return ''
    },
    webResult(json) {
      if (json.code === 0) {
        return json.data
      }
      throw new Error(json.message)
    },
    listMember() {
      let $this = this;
      listMember().then(json => {
        $this.members = json.data;
      })
    },
  },
}
</script>
