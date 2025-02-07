template TradeVerification() {
    signal input tradeResult;
    signal input expectedResult;
    signal output validTrade;

    tradeResult === expectedResult; // This sets the constraint
    validTrade <== 1;
}

component main = TradeVerification();
