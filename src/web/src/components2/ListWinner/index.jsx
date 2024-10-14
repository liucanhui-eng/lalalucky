import "./index.scss";
import { Row, Col } from "@nutui/nutui-react";


export default function Index(props) {

  const { dataList,data } = props;
  const {price,rate,pay_out} = data;

  return (
    <>
      <div className="list-winner">
        <div className="list-play-title">Winner Board</div>
        <Row className="row-title">
          <Col className="row-data-tip" span="7">
          {price} ICP
          </Col>
          <Col className="row-data-tip" span="10">
          {rate}% Win Chance
          </Col>
          <Col className="row-data-tip" span="7">
          {pay_out}% Payout
          </Col>
        </Row>
        <Row className="row-title">
          <Col className="row-data-name" span="7">
            BIAN User Name
          </Col>
          <Col className="row-data-type" span="10">
            Win Number
          </Col>
          <Col className="row-data-date" span="7">
            Prize
          </Col>
        </Row>
        <div className="row-data-box"  >
          {dataList.map((item, index) => {
            return (
              <div key={index}>
                <Row className="row-data">
                  <Col className="row-data-name" span="7">
                    {item.name}
                  </Col>
                  <Col className="row-data-type" span="10">
                    {item.no}
                  </Col>
                  <Col className="row-data-date" span="7">
                    {item.level}X
                  </Col>
                </Row>
              </div>
            );
          })}
        </div>
      </div>

      
    </>
  );
}
