import * as ChimeSDK from 'amazon-chime-sdk-js';

export class ChimeService {
    constructor() {
        this.meetingSession = null;
        this.audioVideo == null;
    }

    async createMeeting(matchId) {
        try {
            // Call backend to create a Chime meeting
            const response = await fetch('/apli/video/create-meeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await this.getToken()}`,
                },
                body: JSON.stringify({ matchId }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.errpr('Error creating meeting: ', error);
            throw error;
        }
    }
    

    async joinMeeting(meetingId, attendeeData) {
        try {
            const logger = new ChimeSDK.ConsoleLogger('MyLogger', ChimeSDK.LogLevel.ERROR);
            const deviceController = new ChimeSDK.DefaultDeviceController(logger);
            const configuration = new ChimeSDK.MeetingSessionConfiguration(meetingId, attendeeData);


            this.meetingSession = new ChimeSDK.DefaultMeetingSession(
                configuration,
                logger,
                deviceController,
            );

            this.audioVideo = this.meetingSession.audioVideo;

            // Set up observers
            this.setupObservers();

            //start A/V
            await this.audioVideo.start();

            return this.meetingSession;
        } catch (error) {
            console.error('Error joining meeting: ', error);
            throw error;
        }
    }

    setupObservers() {
        this.audioVideo.addObserver({
            audioVideodidStart: () => {
                console.log('Meeting started');
            },
            audioVideoDidStop: (sessionStatus) => {
                console.log('Meeting stopped: ', sessionStatus);
            },
            audioVideoDidStartConnecting: (reconnectin) => {
                console.log('Connecting to meeting: ', reconnecting);
            },
            videoTileDidUpdate: (tileState) => {
                console.log('Video tile updated: ', tileState);
                this.videoTileUpdated(tileState);
            },
            videoTileWasRemoved: (tileId) => {
                console.log('Video tile removed: ', tileId);
                this.removeVideoTile(tileId);
            },
        });
    }

    updateVideoTile(tileState) {
        const videoElement = document.getElementById(`video-${tileState.tileId}`);
        if (!videoElement) {
            const newVideoElement = document.createElement('video');
            newVideoElement.id = `video-${tileState.tileId}`;
            newVideoElement.autoplay = true;
            newVideoElement.playsinline = true;
            newVideoElement.style.width = '100%';
            newVideoElement.style.height = '100%';
            newVideoElement.style.objectFit = 'cover';

            const videoContainer = document.getElementById(
                tileState.localTile ? 'local-video' :'remote-videos'
            );
            if (videoContainer) {
                videoContainer.appendChild(newVideoElement);
            }
        }
        this.audioVideo.bindVideoElement(
            tileState.tileId,
            document.getElementById(`video-${tileState.tileId}`)
        );
    }

    removeVideoTile(tileId) {
        const videoElement = document.getElementById(`video-${tileId}`);
        if (videoElement) {
            videoElement.remove();
        }
    }

    async toggleVideo() {
        if (!this.audioVideo) return false;

        const isVideoOn = this.audioVideo.realtimeIsLocalVideoEnabled();

        if (isVideoOn) {
            await this.audioVideo.stopLocalVideoTile();
        } else {
            await this.audioVideo.startLocalVideoTile();
        }

        return !isVideoOn;
    }

    async toggleAudio() {
        if (!this.audioVideo) return false;

        const isMuted = this.audioVideo.realtimeIsLocalAudioMuted();

        if (isMuted) {
            await this.audioVideo.realtimeUnmuteLocalAudio();
        }
        else {
            await this.audioVideo.realtimeMuteLocalAudio();
        }

        return !isMuted;
    }

    async selectAudioInputDevice(deviceId) {
        if (!this.meetingSession) return false;
        
        await this.meetingSession.audioVideo.chooseAudioInputDevice(deviceId);
    }

    async selectVideoDevice(deviceId) {
        if (!this.mmetSession) return;

        await this.meetingSession.audioVideo.chooseVideoInputDevice(deviceId);
    }

    async selectAudioOutputDevice(deviceId) {
        if (!this.meetingSession) return;

        await this.meetingSession.audioVideo.chooseAudioOutputDevice(deviceId);
    }

    async getAudioInputDevices() {
        const devices = await this.meetingSession.audioVideo.getAudioInputDevices();
        return devices;
    }
    
    async getAudioOutputDevices() {
        const devices = await this.meetingSession.audioVideo.getAudioOutputDevices();
        return devices;
    }

    async getVideoDevices() {
        const devices = await this.meetingSession.audioVideo.getVideoInputDevices();
        return devices;
    }

    async leaveMeeting() {
        if (this.audioVideo) {
            await this.audioVideo.stop();
        }
        this.meetingSession = null;
        this.audioVideo = null;
    }

    async getToken() {
        // Get the current user's auth token
        const user = await Auth.currentAuthenticatedUser();
        const session = await Auth.currentSession();
        return session.getIdToken().getJwtToken();
    }

    // Screen sharing
    async startScreenShare() {
        if (!this.audioVideo) return;

        try {
            await this.audioVideo.startContentShareFromScreenCapture();
            return true;
        } catch (error) {
            console.error('Error starting screen share: ', error);
            return false;
        }
    }

    async stopScreenShare(){
        if (!this.audioVideo) return;

        try {
            await this.audioVideo.stopContentShare();
            return true;
        } catch (error) {
            console.error('Error stopping screen share: ', error);
            return false;
        }
    }

    // Recording (requires backend implementation)
    async startRecording() {
        try {
            const response = await fetch('/api/recording/start-recording', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await this.getToken()}`,
                },
            });

            return await response.json();
        } catch (error) {
            console.error('Error starting recording: ', error);
            throw error;
        }
    }

    async stopRecording() {
        try {
            const response = await fetch('/api/recording/stop-recording', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await this.getToken()}`,
                },
                body: JSON.stringify({
                    meetingId: this.meetingSession.configuration.meetingId
                }),
            });

            return await response.json();
        } catch (error) {
            console.error('Failed to stop recording: ', error);
            throw error;
        }
    }

    // Chat functionality during video call
    sendFataMessage(message) {
        if (!this.audioVideo) return;

        this.audioVideo.realtimeSubscribeToReceiveDataMessage('chat', (datamessage) => {
            const textDecoder = new TextDecoder();
            const message = JSON.parse(textDecoder.decoder(datamessage.data));
            useCallback(message, datamessage.senderAttendeeId);
        });
    }
}

export const chimeService = new ChimeService();
