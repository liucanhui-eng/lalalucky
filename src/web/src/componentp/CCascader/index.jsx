import React, { useState } from 'react';
import { Picker, Popup } from '@nutui/nutui-react';
import '@nutui/nutui-react/dist/style.css'; // 确保样式导入

const MyPicker = () => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const options = [
    { text: 'Option 1', value: '1' },
    { text: 'Option 2', value: '2' },
    { text: 'Option 3', value: '3' },
  ];

  return (
    <div>
      <button onClick={() => setVisible(true)}>Show Picker</button>
      <Popup visible={visible} onClose={() => setVisible(false)} position="bottom">
        <Picker
          options={options}
          onConfirm={(selected) => {
            setValue(selected[0].text);
            setVisible(false);
          }}
          onCancel={() => setVisible(false)}
        >
          {{
            toolbar: () => (
              <div className="nut-picker__toolbar">
                <button className="nut-picker__cancel" onClick={() => setVisible(false)}>
                  取消
                </button>
                <button className="nut-picker__confirm" onClick={() => setVisible(false)}>
                  确认按钮
                </button>
              </div>
            ),
          }}
        </Picker>
      </Popup>
      <p>Selected Value: {value}</p>
    </div>
  );
};

export default MyPicker;
