---
date: 2022-05-01
category: IT
tag: 
  - Java
  - Apache
  - POI
permalink: /it/poi-tl
---

# 在文档的任何地方做任何事情

poi-tl（poi template language）是Word模板引擎，使用Word模板和数据创建很棒的Word文档
<!-- more -->

## 文档渲染效果
![img.png](https://img.sherry4869.com/Blog/IT/Apache/POI/poi-tl/img.png)

## 准备工作

### 实现思路
::: tip
根据上图导出效果分析出该模板文档需要渲染出一个顶部的文档标题 `{{activityName}}`  
以及下方区块对 `{{?sections}}` `{{/sections}}`  
区块对中包含：题号文本 `{{titleNumber}}` ，题目文本 `{{title}}`，表格 `{{table}}`，单系列图表 `{{pieChart}}`
:::
::: info 区块对
区块对由前后两个标签组成，开始标签以?标识，结束标签以/标识：`{{?sections}}` `{{/sections}}`  
区块对开始和结束标签中间可以包含多个图片，表格、段落、列表、图表等，开始和结束标签可以跨多个段落，也可以在同一个段落，但是如果在表格中使用区块对，开始和结束标签必须在同一个单元格内，因为跨多个单元格的渲染行为是未知的  
区块对在处理一系列文档元素的时候非常有用，位于区块对中的文档元素可以被渲染零次，一次或N次，这取决于区块对的取值  
[区块对](http://deepoove.com/poi-tl/#_%E5%8C%BA%E5%9D%97%E5%AF%B9)
:::
::: info 表格
表格标签以#开始：`{{#var}}`  
[表格](http://deepoove.com/poi-tl/#_%E8%A1%A8%E6%A0%BC)
:::
::: info 单系列图表
单系列图表的标签是一个文本：`{{var}}`，标签位置在：图表区格式—可选文字—标题（新版本Microsoft Office标签位置在：编辑替换文字-替换文字）  
[单系列图表](http://deepoove.com/poi-tl/#_%E5%8D%95%E7%B3%BB%E5%88%97%E5%9B%BE%E8%A1%A8)
:::

### 创建工程
1. 新建一个Spirng Boot 2.2.x工程
2. 把 [poi-tl-template.docx模板文档](https://img.sherry4869.com/Blog/IT/Apache/POI/poi-tl/poi-tl-template.docx) 下载到工程 src/main/resources/template 目录下

### 相关依赖
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <dependency>
        <groupId>com.deepoove</groupId>
        <artifactId>poi-tl</artifactId>
        <version>1.10.4</version>
    </dependency>
</dependencies>
```

## 编码

### 网络流输出
```java
@RestController
@RequestMapping("/wordController")
public class WordController {
    
    @RequestMapping("/download")
    public void download(HttpServletResponse response) throws Exception {
        //该数据为模拟问卷调查JSON数据，键值对可以根据你的需求自行更改并通过动态获取的方式完善代码
        String jsonStr = "[[{\"optionContent\":\"参与了\",\"proportion\":\"50\",\"voteTurnout\":3},{\"optionContent\":\"没参与\",\"proportion\":\"50\",\"voteTurnout\":3},{\"optionContent\":\"有效参与量：\",\"titleNumber\":\"第1题 【单选】 \",\"voteTurnout\":6,\"title\":\"您是否参与了2021年冠军杯足球比赛活动\"}],[{\"optionContent\":\"运动员\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"拉拉队员\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"工作人员\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"现场\\\\直播观众\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"有效参与量：\",\"titleNumber\":\"第2题 【多选】 \",\"voteTurnout\":3,\"title\":\"您参加本次活动的身份是\"}],[{\"optionContent\":\"工作通知\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"工会宣传组织\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"微信群\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"同事告知\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"有效参与量：\",\"titleNumber\":\"第3题 【多选】 \",\"voteTurnout\":3,\"title\":\"您是通过什么渠道得知本次比赛的\"}],[{\"optionContent\":\"男\",\"proportion\":\"66.67\",\"voteTurnout\":2},{\"optionContent\":\"女\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"有效参与量：\",\"titleNumber\":\"第4题 【单选】 \",\"voteTurnout\":3,\"title\":\"您的性别是\"}],[{\"optionContent\":\"60后\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"70后\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"80后\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"90后\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"00后\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"有效参与量：\",\"titleNumber\":\"第5题 【单选】 \",\"voteTurnout\":3,\"title\":\"您的年龄段是\"}],[{\"optionContent\":\"满意\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"一般（希望您填写原因帮助我们改进）\",\"proportion\":\"66.67\",\"voteTurnout\":2},{\"optionContent\":\"不满意（希望您填写原因帮助我们改进）\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"有效参与量：\",\"titleNumber\":\"第6题 【单选】 \",\"voteTurnout\":3,\"title\":\"您对本届冠军杯足球赛事的整体评价是\"}],[{\"optionContent\":\"每月\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"每季度\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"每半年\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"每年\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"无所谓\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"有效参与量：\",\"titleNumber\":\"第7题 【单选】 \",\"voteTurnout\":3,\"title\":\"您希望协会组织日常足球活动的频率是\"}],[{\"optionContent\":\"定期组织足球训练\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"组织单位间联谊\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"提供合适的场地给员工开展足球活动\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"提供参加社会比赛的机会\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"其他请补充\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"有效参与量：\",\"titleNumber\":\"第8题 【多选】 \",\"voteTurnout\":3,\"title\":\"您希望足球协会能为您做的是\"}],[{\"optionContent\":\"是\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"否\",\"proportion\":\"66.67\",\"voteTurnout\":2},{\"optionContent\":\"有效参与量：\",\"titleNumber\":\"第9题 【单选】 \",\"voteTurnout\":3,\"title\":\"您虽然没参加本次冠军杯足球赛，但是否关注到该活动\"}],[{\"optionContent\":\"工作通知\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"工会宣传组织\",\"proportion\":\"100\",\"voteTurnout\":1},{\"optionContent\":\"微信群\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"同事告知\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"有效参与量：\",\"titleNumber\":\"第10题 【单选】 \",\"voteTurnout\":1,\"title\":\"您是通过什么渠道关注到本次活动的\"}],[{\"optionContent\":\"男\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"女\",\"proportion\":\"100\",\"voteTurnout\":1},{\"optionContent\":\"有效参与量：\",\"titleNumber\":\"第11题 【单选】 \",\"voteTurnout\":1,\"title\":\"您的性别是\"}],[{\"optionContent\":\"60后\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"70后\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"80后\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"90后\",\"proportion\":\"100\",\"voteTurnout\":1},{\"optionContent\":\"00后\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"有效参与量：\",\"titleNumber\":\"第12题 【单选】 \",\"voteTurnout\":1,\"title\":\"您的年龄段是\"}],[{\"optionContent\":\"有兴趣，但是没有时间参加\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"有兴趣学习\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"完全没兴趣\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"有效参与量：\",\"titleNumber\":\"第13题 【单选】 \",\"voteTurnout\":3,\"title\":\"您是否对足球运动感兴趣\"}],[{\"optionContent\":\"愿意参加培训，愿意担任裁判\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"愿意参加培训，不愿意担任裁判\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"不愿意参加培训，愿意担任裁判\",\"proportion\":\"33.33\",\"voteTurnout\":1},{\"optionContent\":\"不愿意参加培训，不愿意担任裁判\",\"proportion\":\"0\",\"voteTurnout\":0},{\"optionContent\":\"有效参与量：\",\"titleNumber\":\"第14题 【单选】 \",\"voteTurnout\":3,\"title\":\"如果足协组织员工足球裁判培训班，您是否愿意参加培训并为今后“冠军杯”比赛担任裁判\"}]]";
        Map<String, Object> renderingData = new HashMap(); //模板文档最终渲染内容的Map键值对，包含一个文本标题activityName以及区块对sections
        List<List<Map<String, Object>>> dataList = new ObjectMapper().readValue(jsonStr, List.class); //JSON反序列化
        List<Map<String, Object>> sections = Lists.newArrayList(); //区块对里渲染的数据集
        renderingData.put("activityName", Texts.of("问卷调查").fontSize(18).bold().fontFamily("微软雅黑").create()); //文本标题
        for (int i = 0; i < dataList.size(); i++) { //遍历14道题目，每道题的包含一个题目内容{"optionContent":"有效参与量：","titleNumber":"题号","title":"题目","voteTurnout":总投票率}以及多个选项内容{"optionContent":"选项内容","proportion":"比例","voteTurnout":当前选项投票率}
            Map<String, Object> section = new HashMap(); //区块对中每次循环渲染的内容
            List<Map<String, Object>> resultList = dataList.get(i); //获取每一道题的的题号，题目，题目选项，小计，比例
            TableRenderData table = Tables.create(null); //创建表格
            table.addRow(Rows.of("选项", "小计", "比例").textColor("333333").bgColor("dbdbdb").center().create()); //设置表头
            String titleNumber = ""; //题号
            String title = ""; //题目
            for (int j = 0; j < resultList.size(); j++) { //遍历当前题目内容
                if (resultList.get(j).containsKey("titleNumber")) { //判断是否为题目内容
                    titleNumber = String.valueOf(resultList.get(j).get("titleNumber")); //题号
                    title = String.valueOf(resultList.get(j).get("title")); //题目
                    MergeCellRule rule = MergeCellRule.builder().map(MergeCellRule.Grid.of(j + 1, 1), MergeCellRule.Grid.of(j + 1, 2)).build(); //合并单元格
                    table.addRow(Rows.create(String.valueOf(resultList.get(j).get("optionContent")), String.valueOf(resultList.get(j).get("voteTurnout")), null)).setMergeRule(rule); //表格的最后一行是统计当前题目所有选项的总有效参与量
                } else { //是否为选项内容
                    table.addRow(Rows.create(String.valueOf(resultList.get(j).get("optionContent")), String.valueOf(resultList.get(j).get("voteTurnout")), String.valueOf(resultList.get(j).get("proportion")).concat("%"))); //表格中选项，小计，比例数据
                }
            }
            String[] optionsName = new String[resultList.size() - 1]; //图表的类别
            Number[] optionsValue = new Number[resultList.size() - 1]; //图表的数值
            for (int j = 0; j < optionsName.length; j++) { //设置图表值
                optionsName[j] = String.valueOf(resultList.get(j).get("optionContent"));
                optionsValue[j] = Double.parseDouble(resultList.get(j).get("proportion").toString());
            }
            ChartSingleSeriesRenderData chart = Charts.ofPie("", optionsName).series("countries", optionsValue).create(); //创建单系列图表并配置图表标题和当前值
            section.put("titleNumber", titleNumber); //区块对里渲染的文本题号
            section.put("title", title); //区块对里渲染的文本题目
            section.put("table", table); //区块对里渲染的表格数据
            section.put("pieChart", chart); //区块对里渲染的单系列图表
            sections.add(section);
        }
        renderingData.put("sections", sections);
        //网络流输出
        response.setContentType("application/octet-stream"); //使客户端浏览器区分不同种类的数据，并根据不同的MIME调用浏览器内不同的程序嵌入模块来处理相应的数据，当前设置为二进制流
        response.setHeader("Content-disposition", "attachment;filename=\"" + "Questionnaire.docx" + "\""); //下载的文件名称
        XWPFTemplate template = XWPFTemplate.compile("src/main/resources/template/poi-tl-template.docx").render(renderingData); //compile编译模板，render渲染数据
        OutputStream out = response.getOutputStream();
        BufferedOutputStream bos = new BufferedOutputStream(out);
        template.write(bos); //输出到流
        bos.flush();
        out.flush();
        PoitlIOUtils.closeQuietlyMulti(template, bos, out); //关闭网络流
    }
}
```

### 输出到本地
```text
XWPFTemplate.compile("src/test/resources/template/poi-tl-template.docx").render(renderingData).writeToFile("src/test/resources/doc/Questionnaire.docx");
```

## 常见问题

### 下载文件中文名被忽略
```text
response.setHeader("Content-disposition", "attachment;filename=\"" + new String("问卷调查.docx".getBytes(),"ISO-8859-1") + "\""); //下载的文件名称
```

### 运行异常
```java
@RestController
@RequestMapping("/wordController")
public class wordController {
    
    @RequestMapping("/download")
    public void download(HttpServletResponse response) throws Exception {
        // 文档导出不成功，程序执行到这步时报java.lang.NoSuchMethodError: org.apache.logging.log4j.Logger.atDebug()Lorg/apache/logging/log4j/LogBuilder;
        XWPFTemplate template = XWPFTemplate.compile("src/main/resources/template/poi-tl-template.docx").render(renderingData);
    }
}
```
```text
文档导出成功，但控制台提示
org.apache.poi.openxml4j.exceptions.InvalidFormatException: A part name shall not have a forward slash as the last character [M1.5]: /word/_rels/
org.apache.poi.openxml4j.exceptions.InvalidFormatException: A part name shall not have a forward slash as the last character [M1.5]: /word/theme/
```
::: tip
如果要使用 poi-tl 1.11.x 以上的版本，spring-boot-starter 的版本要在 2.3.x 以上  
否则使用 poi-tl 1.11.x 以下的版本，例如 poi-tl 1.10.4 / poi-tl 1.9.1
:::

## 参考资料
[官方文档](http://deepoove.com/poi-tl/)