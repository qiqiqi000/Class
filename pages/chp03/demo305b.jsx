import React, { useState } from 'react';
const CarSelector = () => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState(''); 
  // 模拟汽车品牌和型号数据
  const carData = {
    丰田:['卡罗拉', '雷凌', '奕泽', '凯美瑞', '雷克萨斯'],
    本田:['思域', '凌派', '雅阁', '飞度'],
    福特:['福克斯', '福蓝特', '翼虎', '锐界', '探险者']
  };

  const handleBrandChange = (e) => {
    const selectedBrand = e.target.value;
    setSelectedBrand(selectedBrand);
    // 清空之前选择的汽车型号
    setSelectedModel('');
  };

  const handleModelChange = (e) => {
    const selectedModel = e.target.value;
    setSelectedModel(selectedModel);
  };

  return (
    <div style={{padding:10}}>
      <label>选择汽车品牌：</label>
      <select value={selectedBrand} onChange={handleBrandChange} className='comboboxStyle'>
        <option value="">请选择品牌</option>
        {Object.keys(carData).map(brand => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      {selectedBrand && (
        <div>
          <label>选择汽车型号：</label>
          <select value={selectedModel} onChange={handleModelChange} className='comboboxStyle'>
            <option value="">请选择型号</option>
            {carData[selectedBrand].map(model => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedBrand && selectedModel && (
        <p>您选择的汽车是 {selectedBrand} {selectedModel}</p>
      )}
    </div>
  );
};

export default CarSelector;