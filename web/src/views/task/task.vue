<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      title="任务管理"
      class="px-5 py-3"
    >
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
          <router-link :to="{ path: '/task/detail/' + item.id }">
            {{
              item.id
            }}
          </router-link>
        </template>
        <template #item.taskType="{ item }">
          {{ taskTypeName(item.taskType) }}
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
            class="mr-2"
            @click="editContext(item)"
          >
            mdi-domain
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
                  v-model="item.taskType"
                  :items="taskTypes"
                  label="类型"
                  required
                />
              </v-col>
              <v-col cols="12">
                  <v-col cols="1">
                    <v-text-field
                      v-model="workTimeObj.second"
                      menu-props="auto"
                      label="秒"
                    />
                  </v-col>
                  <v-col cols="1">
                    <v-text-field
                      v-model="workTimeObj.minute"
                      menu-props="auto"
                      hide-details
                      label="分"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="workTimeObj.hour"
                      menu-props="auto"
                      hide-details
                      label="小时"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="workTimeObj.day"
                      menu-props="auto"
                      hide-details
                      label="天"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="workTimeObj.month"
                      menu-props="auto"
                      hide-details="true"
                      label="月"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="workTimeObj.week"
                      menu-props="auto"
                      hide-details="true"
                      label="周"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="workTimeObj.year"
                      menu-props="auto"
                      hide-details="true"
                      label="年"
                    />
                  </v-col>
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
                  v-model="item.taskType"
                  :items="taskTypes"
                  label="类型"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="1">
                    <v-text-field
                      v-model="workTimeObj.second"
                      menu-props="auto"
                      label="秒"
                    />
                  </v-col>
                  <v-col cols="1">
                    <v-text-field
                      v-model="workTimeObj.minute"
                      menu-props="auto"
                      hide-details
                      label="分"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="workTimeObj.hour"
                      menu-props="auto"
                      hide-details
                      label="小时"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="workTimeObj.day"
                      menu-props="auto"
                      hide-details
                      label="天"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="workTimeObj.month"
                      menu-props="auto"
                      hide-details="true"
                      label="月"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="workTimeObj.week"
                      menu-props="auto"
                      hide-details="true"
                      label="周"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="workTimeObj.year"
                      menu-props="auto"
                      hide-details="true"
                      label="年"
                    />
                  </v-col>
                </v-row>
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
      max-width="600"
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
                <v-select
                  v-model="item.taskType"
                  :items="taskTypes"
                  label="类型"
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.workTime"
                  label="表达式"
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

    <v-dialog
      v-model="dialog.MailReader"
      transition="dialog-top-transition"
      max-width="600"
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
                <v-select
                  v-model="context.sourceAccountId"
                  :items="mailAccounts"
                  label="邮箱账号配置"
                  required
                  item-text="account"
                  item-value="id"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="context.targetEmail"
                  label="账单邮箱"
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
      v-model="dialog.MailParser"
      transition="dialog-top-transition"
      max-width="900"
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
              <v-col cols="10">
                <v-text-field
                  v-model="context.cardNumberExpress.express"
                  label="卡号"
                />
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="context.cardNumberExpress.regex"
                  label="表达式"
                />
              </v-col>
              <v-col cols="10">
                <v-text-field
                  v-model="context.transactionDateExpress.express"
                  label="交易日"
                />
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="context.transactionDateExpress.regex"
                  label="表达式"
                />
              </v-col>

              <v-col cols="10">
                <v-text-field
                  v-model="context.transactionAmountExpress.express"
                  label="记账金额"
                />
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="context.transactionAmountExpress.regex"
                  label="表达式"
                />
              </v-col>

              <v-col cols="10">
                <v-text-field
                  v-model="context.bookkeepingDateExpress.express"
                  label="记账日期"
                />
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="context.bookkeepingDateExpress.regex"
                  label="表达式"
                />
              </v-col>

              <v-col cols="10">
                <v-text-field
                  v-model="context.bookkeepingAmountExpress.express"
                  label="记账金额"
                />
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="context.bookkeepingAmountExpress.regex"
                  label="表达式"
                />
              </v-col>

              <v-col cols="10">
                <v-text-field
                  v-model="context.descriptionExpress.express"
                  label="说明"
                />
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="context.descriptionExpress.regex"
                  label="表达式"
                />
              </v-col>

              <v-col cols="10">
                <v-text-field
                  v-model="context.bookkeepingAmountUnitExpress.express"
                  label="记账单位"
                />
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="context.bookkeepingAmountUnitExpress.regex"
                  label="表达式"
                />
              </v-col>

              <v-col cols="10">
                <v-text-field
                  v-model="context.transactionAmountUnitExpress.express"
                  label="交易单位"
                />
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="context.transactionAmountUnitExpress.regex"
                  label="表达式"
                />
              </v-col>

              <v-col cols="10">
                <v-text-field
                  v-model="context.recordTypeExpress.express"
                  label="交易类型"
                />
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="context.recordTypeExpress.regex"
                  label="表达式"
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="context.recordTypeResolver"
                  label="数据处理"
                />
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="context.sourceEmail"
                  :items="contentMails"
                  label="源数据"
                  required
                />
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="context.targetAccountId"
                  :items="financeAccounts"
                  label="目标账户"
                  required
                  item-text="description"
                  item-value="id"
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
import {check302} from '../../net.js'

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
        MailReader: false,
        MailParser: false,
      },
      workTimeObj: {
        month: '*',
        day: '*',
        hour: '*',
        minute: '*',
        second: '*',
        week: '*',
        year: '*',
      },
      query: {},
      options: {page: 1, itemsPerPage: 10},
      context: {
        cardNumberExpress: {},
        transactionDateExpress: {},
        transactionAmountExpress: {},
        bookkeepingDateExpress: {},
        bookkeepingAmountExpress: {},
        descriptionExpress: {},
        bookkeepingAmountUnitExpress: {},
        transactionAmountUnitExpress: {},
        recordTypeExpress: {},
      },
      item: {
        id: 0,
        taskType: 0,
        workTime: 0,
        description: '',
      },
      taskTypes: [{
        value: 1,
        text: '读取邮件',
      }, {
        value: 2,
        text: '解析邮件',
      }],
      mailAccounts: [],
      contentMails: [],
      financeAccounts: [],
      headers: [
        {
          text: 'ID',
          value: 'id',
          width: 70,
        },
        {text: '类型', value: 'taskType', width: 100},
        {text: '表达式', value: 'workTime', width: 200},
        {text: '说明', value: 'description'},
        {text: '', value: 'actions', sortable: false, width: 100},
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
  },
  mounted() {
    this.parseUrl()
  },
  methods: {
    parseUrl() {
      const type = this.$route.params.type
      if (type) {
        switch (type) {
          case 'add': {
            this.item.id = null
            this.item.taskType = null
            this.item.workTime = null
            this.item.description = ''
            this.item.context = '{}'
            this.workTimeObj = {
              month: '*',
              day: '*',
              hour: '*',
              minute: '*',
              second: '*',
              week: '*',
              year: '*',
            }
            this.dialog[type] = true
            break
          }
          case 'detail':
          case 'update': {
            const that = this
            const id = this.$route.params.id
            const taskType = this.$route.params.taskType
            this.detail(id, function () {
              if (taskType === '1') {
                that.queryMailAccount()
                that.dialog.MailReader = true
              } else if (taskType === '2') {
                that.queryTask()
                that.queryFinanceAccount()
                that.dialog.MailParser = true
              } else {
                that.dialog[type] = true
              }
            })
            break
          }
        }
      } else {
        this.dialog.add = false
        this.dialog.detail = false
        this.dialog.update = false
        this.dialog.MailReader = false
        this.dialog.MailParser = false
      }
    },
    list(callback) {
      const $this = this
      const {page, itemsPerPage} = this.options
      const res = fetch(
        '/api/task?currentPage=' + page + '&pageSize=' + itemsPerPage, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json;',
            'X-Requested-With': 'fetch',
          },
          body: JSON.stringify({
            currentPage: page,
            pageSize: itemsPerPage,

          }),
        },
      )
        .then(check302)
        .then((res) => {
          return res.json()
        })
        .then((json) => {
          $this.page.list = json.data.list
          $this.page.total = json.data.totalCount
        })
      if (callback) {
        res.then(callback)
      }
    },
    add() {
      this.$router.push('/task/add')
    },
    update(item) {
      this.$router.push('/task/update/' + item.id)
    },
    editContext(item) {
      this.$router.push('/task/update/' + item.id + '/' + item.taskType)
    },
    close() {
      this.$router.push('/task')
    },
    save() {
      const $this = this
      let promise
      $this.item.workTime = this.workTimeObj.second + ' ' + this.workTimeObj.minute + ' ' + this.workTimeObj.hour + ' ' + this.workTimeObj.day + ' ' + this.workTimeObj.month+ ' ' + this.workTimeObj.week+ ' ' + this.workTimeObj.year
      $this.item.context = JSON.stringify($this.context)
      if ($this.item.id) {
        promise = fetch('/api/task/' + $this.item.id, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json;',
          },
          body: JSON.stringify($this.item),
        })
      } else {
        $this.item.id = -1
        $this.context = ''
        promise = fetch('/api/task', {
          method: 'PUT',
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
          $this.$router.push('/task')
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
      fetch('/api/task/' + $this.item.id, {
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
      const prom = fetch('/api/task/' + id)
        .then((resp) => {
          return resp.json()
        })
        .then($this.webResult)
        .then((data) => {
          $this.item = data
          $this.workTimeObj = $this.parseWorkTime($this.item)
          if (this.item.taskType === 2) {
            $this.context = {
              cardNumberExpress: {},
              transactionDateExpress: {},
              transactionAmountExpress: {},
              bookkeepingDateExpress: {},
              bookkeepingAmountExpress: {},
              descriptionExpress: {},
              bookkeepingAmountUnitExpress: {},
              transactionAmountUnitExpress: {},
              recordTypeExpress: {},
            }
          }
          $this.context = Object.assign($this.context, JSON.parse(data.context))
        })
        .catch((e) => {

        })
      if (callback) {
        prom.then(callback)
      }
    },
    taskTypeName(type) {
      for (const i in this.taskTypes) {
        if (this.taskTypes[i].value === type) {
          return this.taskTypes[i].text
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
    parseWorkTime(workTime) {
      const a = workTime.workTime.split(' ')
      return {
        second: a[0],
        minute: a[1],
        hour: a[2],
        day: a[3],
        month: a[4],
        week: a[5],
        year: a[6],
      }
    },
    createArray(s, e) {
      const result = []
      result.push('*')
      for (let i = s; i <= e; i++) {
        result.push(i + '')
      }
      return result
    },
    queryMailAccount() {
      const $this = this
      fetch('/api/mail/account', {
        method: 'GET',
      })
        .then((resp) => {
          return resp.json()
        })
        .then($this.webResult)
        .then((list) => {
          $this.mailAccounts = list
        })
    },
    queryTask() {
      const $this = this
      fetch('/api/task/content/email', {
        method: 'GET',
      })
        .then((resp) => {
          return resp.json()
        })
        .then($this.webResult)
        .then((list) => {
          $this.contentMails = list
        })
    },
    queryFinanceAccount() {
      const $this = this
      fetch('/api/finance/account/list', {
        method: 'GET',
      })
        .then((resp) => {
          return resp.json()
        })
        .then($this.webResult)
        .then((list) => {
          $this.financeAccounts = list
        })
    },
  },
}
</script>
