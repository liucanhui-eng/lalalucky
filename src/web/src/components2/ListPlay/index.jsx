import "./index.scss";
import { Row, Col, Skeleton } from "@nutui/nutui-react";
export default function Index(props) {
  const { dataList, isLoading } = props;
  return (
    <>
      <div className="list-play-v1">
        <div className="list-play-title">

          <div className="title">Play Board</div>
          <div className="tips">The latest 50 lottery draws</div>
        </div>
        <div className="list-play-box">
          {/* <Skeleton rows={3} visible={!isLoading}> */}
          {dataList.map((item, index) => {
            return (
              <div className="row-data" key={index}>
                <Row className="row-data">
                  <Col className="row-data-name" span="10">
                    {item.name}
                  </Col>
                  <Col className="row-data-type" span="6">
                    {item.type}
                  </Col>
                  <Col className="row-data-date" span="8">
                    {item.date}
                  </Col>
                </Row>
              </div>
            );
          })}
          {/* </Skeleton> */}
        </div>
      </div>
    </>
  );
}
