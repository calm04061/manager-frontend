<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-select
        :items="platforms"
        label="平台"
        item-text="name"
        item-value="id"
        v-model="query.platformId"
        clearable
      ></v-select>
      <v-select
        :items="accounts"
        label="账户"
        item-text="account"
        item-value="id"
        v-model="query.accountId"
        clearable
      ></v-select>
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
import net from "../../net";
export default {
  name: "Dashboard",

  mounted() {
    this.listPlatform();
    this.analysisData();
  },
  data() {
    return {
      query: {
        platformId: "",
        accountId: "",
      },
      platforms: [],
      accounts: [],
      snackbar: false,
      text: "Hello, I'm a snackbar",
      option: null,
    };
  },
  watch: {
    "query.platformId": {
      handler(val, oldVal) {
        if (val != oldVal) {
          this.listAccount(val, this.analysisData);
        }
      },
      deep: true,
    },
    "query.accountId": {
      handler(val, oldVal) {
        if (val != oldVal) {
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
      let url = "/api/finance/analysis?days=20";
      if ($this.query.platformId) {
        url = url + "&platformId=" + $this.query.platformId;
      }
      if ($this.query.accountId) {
        url = url + "&accountId=" + $this.query.accountId;
      }
      fetch(url, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then(function (resp) {
          return resp.json();
        })
        .then(net.webResult)
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
          // $this.option.xAxis.data = labels;
          // $this.option.series[0] = {
          //   data: amounts,
          // };
          // $this.option.series[1] = {
          //   data: amountSub,
          // };

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
      fetch("/api/finance/platform/list", {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then(net.webResult)
        .then((data) => {
          $this.platforms = data;
        });
    },
    listAccount(platformId, callback) {
      let $this = this;
      if (platformId) {
        fetch("/api/finance/account/list?platformId=" + platformId)
          .then((res) => {
            return res.json();
          })
          .then(net.webResult)
          .then((data) => {
            $this.accounts = data;
          });
      } else {
        $this.accounts = [];
      }
      $this.query.accountId = null;
      if (callback) {
        callback();
      }
    },
  },
};
</script>
