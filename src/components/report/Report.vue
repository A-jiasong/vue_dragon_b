<template>
	<div>
		<h3>数据报表</h3>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>数据统计</el-breadcrumb-item>
			<el-breadcrumb-item>数据报表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区域 -->
		<el-card>
			<!-- 2.给盒子 -->
			<div id="main" style="width: 750px;height:400px;"></div>
		</el-card>
	</div>
</template>

<script>
	// 1.导入
	// import echarts from 'echarts';
	import echarts from './echarts.min.js'
	import _ from 'lodash';
	export default {
		data() {
			return {
				//需要跟请求的折线图数据合并的options
        options: {
          title: {
            text: '用户来源',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3',
              },
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: [
            {
              boundaryGap: false,
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
        },
				echarts,
			}
		},
		created() {

		},
		async mounted() {
			//在页面dom元素加载完毕之后执行的钩子函数mounted
			// 3.基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main'));
			// 4.指定图表的配置项和数据
			// var option = {
			// 	title: {
			// 		text: 'ECharts 入门示例'
			// 	},
			// 	tooltip: {},
			// 	legend: {
			// 		data: ['销量']
			// 	},
			// 	xAxis: {
			// 		data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
			// 	},
			// 	yAxis: {},
			// 	series: [{
			// 		name: '销量',
			// 		type: 'bar',
			// 		data: [5, 20, 36, 10, 10, 20]
			// 	}]
			// };

			// 发送请求获取折线图数据
			const {data:res} = await this.$http.get(`reports/type/1`);
			if(res.meta.status !== 200) {
				return this.$message.error('获取折线图数据失败')
			}
			//合并res.data和this.options
			const result = _.merge(res.data, this.options)
			
			// 5.使用刚指定的配置项和数据显示图表。
			myChart.setOption(result);

		},
		methods: {

		},
	}
</script>

<style lang="less" scoped>

</style>
