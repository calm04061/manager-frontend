<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="4">
        <v-select
          :items="members"
          label="成员"
          item-text="name"
          item-value="id"
          v-model="query.memberId"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="4">
      <v-select
        :items="platforms"
        label="平台"
        item-text="name"
        item-value="id"
        v-model="query.platformId"
        clearable
      ></v-select>
      </v-col>
      <v-col cols="4">
      <v-select
        :items="accounts"
        label="账户"
        item-text="account"
        item-value="id"
        v-model="query.accountId"
        clearable
      ></v-select>
      </v-col>
    </v-row>
    <!-- <base-material-chart-card
      :option="option"
      color="success"
      hover-reveal
      type="Bar"
    >
    </base-material-chart-card> -->
    <v-chart class="chart" :option="option" autoresize style="height: 450px" />
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
<script>
import net from "@/net";
import {financeAnalysis, listAccount, listMember, listPlatform} from "@/service/api";
export default {
  name: "Dashboard",

  mounted() {
    this.listPlatform();
    this.listMember();
    this.analysisData();
  },
  data() {
    return {
      query: {
        platformId: "",
        memberId: "",
        accountId: "",
      },
      platforms: [],
      members: [],
      accounts: [],
      snackbar: false,
      text: "Hello, I'm a snackbar",
      option: null,
    };
  },
  watch: {
    "query.memberId": {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.listAccount(val,this.query.platformId, this.analysisData);
        }
      },
      deep: true,
    },
    "query.platformId": {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.listAccount(this.query.memberId,val, this.analysisData);
        }
      },
      deep: true,
    },
    "query.accountId": {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.analysisData();
        }
      },
      deep: true,
    },
  },
  methods: {
    complete(index) {
      this.list[index] = !this.list[index];
    },
    analysisData() {
      let $this = this;
      financeAnalysis($this.query.memberId,$this.query.platformId,$this.query.accountId)
        .then(function (data) {
          let labels = [];
          let amounts = [];
          let amountSub = [];
          let preAmount = 0;
          data.forEach((elem) => {
            labels.push(elem.amountTime);
            amounts.push(elem.amount);
            amountSub.push(elem.amount - preAmount);
            preAmount = elem.amount;
          });
          amountSub[0] = 0;
          $this.option = {
            xAxis: {
              data: labels,
            },
            tooltip: {
              formatter: " {b} : {c}￥",
              trigger: "axis",
              axisPointer: {
                type: "cross",
                crossStyle: {
                  color: "#999",
                },
              },
            },
            yAxis: [
              {
                type: "value",
                name: "余额",
                axisLabel: {
                  formatter: "{value} ￥",
                },
              },
              {
                type: "value",
                name: "日差",
                axisLabel: {
                  formatter: "{value} ￥",
                },
              },
            ],
            series: [
              {
                data: amounts,
                type: "line",
                smooth: true,
                name: "余额",
              },
              {
                data: amountSub,
                type: "bar",
                smooth: true,
                name: "日差",
                label: {
                  show: true,
                  position: "top",
                },
              },
            ],
          };
          //
          // debugger
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listPlatform() {
      let $this = this;
      listPlatform().then((data)=>{
        $this.platforms = data;
      });
    },
    listMember() {
      let $this = this;
      listMember().then(json => {
        $this.members = json.data;
      })
    },
    listAccount(memberId,platformId, callback) {
      let $this = this;
      listAccount(memberId,platformId).then(data => {
        $this.accounts = data;
      })
      $this.query.accountId = null;
      if (callback) {
        callback();
      }
    },
  },
};
</script>
