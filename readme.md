## CoinScene ##
*vite* *three* *vue3* *jsx* *less*
### 2.0 ###
* Scene 主场景
* <font style="background:#dedede">entity</font> Tiles 3dtiles加载 <font style="background:#228b22;color:white">已支持(2021/08/30)</font>
* <font style="background:#dedede">entity</font> Model [.fbx] [.gltf] [.gltf.gz分层加载] <font style="background:#1e90ff;color:white">已支持.fbx.gltf(2021/09/02)</font>
* <font style="background:#dedede">entity</font> Voxel 体素模型 <font style="background:#1e90ff;color:white">已支持固定步长(待完善)</font>
* <font style="background:#dedede">entity</font> Label 标注 Icon 图标 (css2drender)
* <font style="background:#dedede">entity</font> Point 点 Line 线 Polygon 面
* <font style="background:#dedede">entity</font> GeoJsonLayer
* <font style="background:#dedede">entity</font> LabelLayer IconLayer
* <font style="background:#dedede">entity</font> PointLayer LineLayer PolygonLayer
* <font style="background:#dedede">entity</font> ModelLayer
* <font style="background:#dedede">widget</font> Compass 三维罗盘 <font style="background:#228b22;color:white">已完成(2021/08/28)</font>
* <font style="background:#dedede">widget</font> BoxRuler 三维刻度尺 <font style="background:#228b22;color:white">已完成(2021/09/15)</font>
* <font style="background:#dedede">widget</font> Scaler 比例尺 <font style="background:#228b22;color:white">已完成(2021/09/06)</font>
* <font style="background:#dedede">widget</font> Legend 自动生成图例 <font style="background:#228b22;color:white">已完成(2021/09/07)</font>
* <font style="background:#dedede">vue component</font> Tree 模型树控件 勾选 编辑? (jsx 下同)
* <font style="background:#dedede">vue component</font> Pick 全程支持点选?(射线检测性能) 属性拾取
* <font style="background:#dedede">vue component</font> Measure 模型量测 距离 面积 体积
* <font style="background:#dedede">vue component</font> Cut 剖切 [栅状图][xyz面剖切、自定义面剖切] (three剪裁性能)
* <font style="background:#dedede">vue component</font> SlicingCut 分层剖切
* <font style="background:#dedede">vue component</font> Hole 虚拟钻孔
* <font style="background:#dedede">vue component</font> FoundationPit 基坑开挖 (three剪裁性能)
* <font style="background:#dedede">vue component</font> DisplaySetting 显示设置 缩放 网格 展开
* <font style="background:#dedede">vue component</font> TunnelRoaming 隧道漫游
* UI主题：primary light dark <font style="background:#1e90ff;color:white">已完成：primary</font>
* 模型加载进度条与开场动画 <font style="background:#228b22;color:white">已完成(2021/09/09)</font>
* 差异模型shader材质适配
* 复杂算法webworker优化测试
* jenkins自动部署持续集成 [自动更新：文档/站点/SDK] <font style="background:#228b22;color:white">已完成(2021/09/16)</font>
* 开发文档/使用手册 <font style="background:#1e90ff;color:white">已完成：开发文档(jsdoc持续更新)</font>
* 正在使用旧版的各项目升级计划

### 2.1 ###
* 粒子系统

### 2.2 ###
* 绘制与素材集成
* 路径绘制与动画保存

### 2.3 ###
* 沙盒

### link
* *demo：* <http://192.168.1.240:5000>
* *SDK：* <http://192.168.1.240:5000/cdn/coinscene.umd.js>
* *document：* <http://192.168.1.240:5000/doc>
* *iconfont：* <https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=2764524&keyword=&project_type=&page=>
* *fbx参考：* <http://park.vr100.com/intest/showuiAppIo3js.html?appid=381>
* *体素模型参考：* <https://threejsfundamentals.org/threejs/lessons/threejs-voxel-geometry.html>

### 问题：
* 模型数据不统一的效果优化 <br>
* 如何适配左手坐标系下的模型（opengl默认右手坐标系）<br>
* 如何处理.gltf.fbx模型数据以支持LOD<br>
* vue组件打包到项目的使用情况测试<br>