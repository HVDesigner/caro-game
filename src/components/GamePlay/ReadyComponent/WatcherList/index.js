import React from "react";
import "./index.css";
import {
  useFirestoreDocDataOnce,
  useFirestore,
  SuspenseWithPerf,
} from "reactfire";
import { Container, Row, Col } from "react-bootstrap";

// Context
import AppContext from "./../../../../context/";

// SVG
import UserSVG from "./../../../../assets/Dashboard/user.svg";

function WatcherList({ roomData }) {
  const [listWatcher, setListWatcher] = React.useState([]);

  React.useEffect(() => {
    if (roomData.participants.watcher) {
      setListWatcher(roomData.participants.watcher);
    } else {
      setListWatcher([]);
    }
  }, [roomData.participants.watcher]);

  return (
    <div>
      <p className="mb-1 text-white text-stroke-carotv">Danh sách người xem:</p>
      <Container className="brown-border rounded pt-2 mb-2 watcher-list-box overflow-auto shadow">
        <Row>
          {listWatcher.map((value, key) => (
            <Col key={key} className="mb-2">
              <SuspenseWithPerf
                fallback={<p className="m-0 text-white">Loading...</p>}
                traceId={"load-watcher-user"}
              >
                <WatcherDetail uid={value} />
              </SuspenseWithPerf>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default WatcherList;

function WatcherDetail({ uid }) {
  const { toggleInfoModal } = React.useContext(AppContext);

  const userRef = useFirestore().collection("users").doc(uid);

  const user = useFirestoreDocDataOnce(userRef);

  return (
    <div className="d-flex watcher-detail">
      <img
        src={user.image_url ? user.image_url : UserSVG}
        alt="user"
        className={
          user.image_url ? `rounded-circle brown-border shadow mr-2` : `mr-2`
        }
        onClick={() => {
          toggleInfoModal(true, uid);
        }}
      />
      <p className="align-self-center text-white">{user.name.value}</p>
    </div>
  );
}
