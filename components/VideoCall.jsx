import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:5000");

const VideoCall = () => {
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const userVideo = useRef();
    const partnerVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
            if (userVideo.current) userVideo.current.srcObject = stream;
        });

        socket.on("callIncoming", ({ from, signal }) => {
            setReceivingCall(true);
            setCaller(from);
            setCallerSignal(signal);
        });
    }, []);

    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on("signal", (data) => {
            socket.emit("callUser", { userToCall: id, signalData: data, from: socket.id });
        });
        peer.on("stream", (currentStream) => {
            partnerVideo.current.srcObject = currentStream;
        });

        socket.on("callAccepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller });
        });
        peer.on("stream", (currentStream) => {
            partnerVideo.current.srcObject = currentStream;
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    return (
        <div>
            <h2>Video Consultation</h2>
            <div>
                <video playsInline muted ref={userVideo} autoPlay style={{ width: "300px" }} />
                {callAccepted && <video playsInline ref={partnerVideo} autoPlay style={{ width: "300px" }} />}
            </div>
            <button onClick={() => callUser("DOCTOR_SOCKET_ID")}>Call Doctor</button>
            {receivingCall && !callAccepted && (
                <button onClick={answerCall}>Answer Call</button>
            )}
        </div>
    );
};

export default VideoCall;
