import React, { useState, useMemo } from 'react';
import { Button } from 'antd';
import './App.css';
import 'antd/dist/antd.css'

// 特性列表
const specList = [
    { featureId: 33, title: "颜色", list: ["白色", "红色"] },
    { featureId: 44, title: "内存", list: ["16G", "32G"] },
    { featureId: 55, title: "容量", list: ["150ml", "300ml", "450ml"] }
];

// sku 列表
const specCombinationList = [
    { id: "1", specs: ["红色", "16G", "450ml"], price: 100, count: 10 },
    { id: "2", specs: ["红色", "32G", "150ml"], price: 120, count: 20 },
    { id: "3", specs: ["红色", "32G", "300ml"], price: 130, count: 30 },
    { id: "4", specs: ["红色", "32G", "450ml"], price: 110, count: 50 },
    { id: "5", specs: ["白色", "16G", "150ml"], price: 90, count: 60 },
    { id: "6", specs: ["白色", "16G", "300ml"], price: 90, count: 70 },
    { id: "7", specs: ["白色", "16G", "450ml"], price: 170, count: 80 },
    { id: "8", specs: ["白色", "32G", "150ml"], price: 80, count: 120 },
    { id: "9", specs: ["白色", "32G", "300ml"], price: 70, count: 150 },
    { id: "10", specs: ["白色", "32G", "450ml"], price: 30, count: 200 }
];

interface ChoosedValue {
    title: string;
    value: string;
}

interface CombinationItem {
    id: string;
    specs: string[];
    price: number;
    count: number
}

const App:React.FC = () => {
    const [choosedValue, setChoosedValue] = useState<ChoosedValue[]>([]); // 当前被选中的特性值

    // 可选的特性值列表
    const filterCombinationList = useMemo(() => {
        return specCombinationList?.reduce((total, item) => {
            const { specs, price, count } = item;
            const bingo = Array.isArray(choosedValue) ? choosedValue.every(i => specs.includes(i.value)) : false;
            // 如果过滤条件符合
            if(bingo){
                total = {
                    featureValueList: [...total.featureValueList, ...specs],
                    priceList: [...total.priceList, price],
                    totalCount: total.totalCount + count
                };
            } 
            
            return total;
        }, { featureValueList: [] as string[], priceList: [] as number[], totalCount: 0 });
        
    }, [choosedValue]);

    // 对已经选中的特性值按照特性列表重新排序
    const sortChoosedValue = useMemo(() => {
        return specList?.reduce((total, item) => {
            const { title } = item;
            const obj = choosedValue?.find(it => it.title === title) ;

            if(obj){
                total.push(obj);
            }

            return total;
        }, [] as ChoosedValue[]);
    }, [choosedValue]);


    // 切换选择
    const onToggleChoose = (title: string, featureValue: string) => {
        const index = choosedValue?.findIndex((it: { value: string; }) => it.value === featureValue);

        if(index < 0){
            setChoosedValue([...choosedValue, { title, value: featureValue }]);  
        } else {
            choosedValue.splice(index, 1);
            setChoosedValue([...choosedValue]);
        }
    };

    // 获取价格区间
    const getPrice = () => {
        let priceList = filterCombinationList?.priceList;
        
        if(Array.isArray(priceList)){
            priceList.sort((a, b) => a - b);
            if(priceList.length > 1){
                return (
                    <span>[{priceList[0]} ~ {priceList[priceList.length - 1]}]</span>
                );
            }

            return priceList[0];
        }

        return '';
    };
    
    return (
        <div>
            <div>
                <span>选择结果：</span>
                {
                    sortChoosedValue?.map(({ value }) => {
                        return <span key={value} style={{ marginRight: 8 }}>{value}</span>;
                    })
                }

                <div>
                    <span>价格:</span>
                    {
                        getPrice()
                    }
                    <span>{}</span>
                </div>

                <div>
                    <span>库存:</span>
                    <span>{filterCombinationList?.totalCount}</span>
                </div>
            </div>
            {
                specList.map(it => {
                    const { title, list } = it;

                    return (
                        <div key={title}>
                            <span>{title}</span>
                            {
                                list.map(i => {
                                    // 判断当前阶段是否被选中了
                                    const isChoosed = choosedValue?.some((_i: {value:string}) => _i.value === i);

                                    return (
                                        <Button
                                            type={isChoosed ? 'primary' : 'default'}
                                            disabled={!filterCombinationList?.featureValueList?.includes(i)} 
                                            key={i}
                                            onClick={() => onToggleChoose(title, i)}
                                            style={{ marginLeft: 8 }}
                                        >{i}</Button>
                                    );
                                })
                            }
                        </div>
                    );
                })
            }
        </div>
    );
};

export default App;
