import Vue from 'vue'

import ECharts from 'vue-echarts'
import { use } from "echarts/core";


// 手动引入 ECharts 各模块来减小打包体积
import {
    CanvasRenderer
  } from 'echarts/renderers'
  import {
    LineChart,
    BarChart,
    
  } from 'echarts/charts'
  import {
    GridComponent,
    TooltipComponent,
    ToolboxComponent 
  } from 'echarts/components'
  
  use([
    CanvasRenderer,
    LineChart,
    BarChart,
    GridComponent,
    TooltipComponent,
    ToolboxComponent 
  ]);

  Vue.component('v-chart', ECharts)