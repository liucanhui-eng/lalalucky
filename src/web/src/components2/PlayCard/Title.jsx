import React from 'react';

const Title = ({ isLogin, walletBalance }) => {
    const renderTitle = () => {
        if (isLogin) {
            return parseFloat(walletBalance) < 0.001 ? 'Insufficient balance' : 'Try your luck';
        }
        return 'Try your luck';
    };

    return <span>{renderTitle()}</span>;
};

export default Title;
