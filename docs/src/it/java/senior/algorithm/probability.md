---
category: IT
article: false
---

# 概率

## 概率区间数获取奖品

```java
import lombok.Data;

@Data
public class Prize {

    /**
     * 奖项Id
     */
    private Long prizeId;

    /**
     * 奖品名称
     */
    private String prizeName;

    /**
     * 中奖概率
     */
    private Long percent;

    public Prize(Long prizeId, String prizeName, Long percent) {
        this.prizeId = prizeId;
        this.prizeName = prizeName;
        this.percent = percent;
    }
}
```

```java
import com.mw.entity.Prize;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PrizeService(){
    
    public Prize luckDraw(){
        // 初始化奖品列表
        List<Prize> prizes = new ArrayList<>();
        Prize prize = new Prize(1L, "奖品1", 50L);
        Prize prize2 = new Prize(2L, "奖品2", 30L);
        Prize prize3 = new Prize(3L, "奖品3", 10L);
        prizes.add(prize);
        prizes.add(prize2);
        prizes.add(prize3);

        int end = 0; // 用于跟踪中奖范围的结束位置
        Map<String, String> rateMap = new HashMap<>(); // 奖品概率区间集
        Map<String, Prize> prizeMap = new HashMap<>(); // 奖品集
        /**
         * 通过遍历奖品列表，计算每个奖品对应的概率区间。rateMap 中的键是奖品的ID，值是概率区间的起始值和结束值
         * rateMap 的值为：{1=1,50, 2=51,80, 3=81,90}
         * prizeMap 的值为：{1=Prize(prizeId=1, prizeName=奖品1, percent=50), 2=Prize(prizeId=2, prizeName=奖品2, percent=30), 3=Prize(prizeId=3, prizeName=奖品3, percent=10)}
         */
        for (Prize entity : prizes) {
            rateMap.put(String.valueOf(entity.getPrizeId()), (end + 1) + "," + (end + entity.getPercent().intValue()));
            prizeMap.put(String.valueOf(entity.getPrizeId()), entity);
            end += entity.getPercent().intValue(); // 当前配置了3个奖品，第一个奖品的中奖概率是50%，第二个奖品的中奖概率是30%，第三个奖品的中奖概率是10%。因此 end 的值为 90
        }
        Prize goodPrize = null; // 中奖奖品
        SecureRandom random = null;
        try {
            random = SecureRandom.getInstance("SHA1PRNG"); // 使用 SHA1PRNG 算法初始化一个 SecureRandom 对象。SecureRandom 是 Java 中提供的一个强加密随机数生成器的类
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        int next = -1;
        next = random.nextInt(end + 1); // 生成一个介于0（包含）和 end + 1（不包含）之间的随机整数。生成的结果存储在变量 next 中
        if (next == 0) { // 如果生成的随机整数是 0，将 next 的值设置为 1
            next = 1;
        }
        // 遍历rateMap中的每个条目，entry.getKey()是键，entry.getValue()是对应的值
        for (Map.Entry<String, String> entry : rateMap.entrySet()) {
            /**
             * 将值使用逗号分隔，得到一个字符串数组items
             * 例如 {1=1,50, 2=51,80, 3=81,90} 第一次循环的时候获取的到的 items 值为 ["1","50"] 以此类推 第二次循环 ["51,80"] 第三次循环 ["81","90"]
             */
            String[] items = entry.getValue().split(",");
            // 使用Integer.parseInt()将items[0]和items[1]转换为整数，然后检查 next 随机数是否在这两个整数之间（包括边界）
            if (Integer.parseInt(items[0]) <= next && next <= Integer.parseInt(items[1])) {
                // 如果 next 在指定范围内，就从 prizeMap 中根据 rateMap 的键获取相应的奖品
                goodPrize = prizeMap.get(entry.getKey());
                break;
            }
        }
        return goodPrize;
    }
}
```