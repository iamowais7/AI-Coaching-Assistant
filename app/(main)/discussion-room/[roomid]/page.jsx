"use client"

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { CoachingExpert } from '@/services/Options'
import { UserButton } from '@stackframe/stack'
import { useQuery } from 'convex/react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
// import RecordRTC from 'recordrtc'
const RecordRTC = dynamic(()=>import("recordrtc"),{ssr:false});

function DiscussionRoom () {
  const {roomid} = useParams()
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom,{id:roomid});
  const [expert,setExpert] = useState();
  const [enableMic,setEnablemic] = useState()
  const recorder = useRef(null)
  let silenceTimeout;

  useEffect(()=>{
    if(DiscussionRoomData){
      const Expert = CoachingExpert.find(item=>item.name === DiscussionRoomData.expertName)
      console.log(Expert)
      setExpert(Expert)
    }
  },[DiscussionRoomData])

  const connectToServer = async () => {
    setEnablemic(true);
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
        const { default: RecordRTC, StereoAudioRecorder } = await import("recordrtc");
  
        recorder.current = new RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/webm;codecs=pcm',
          recorderType: StereoAudioRecorder,
          timeSlice: 250,
          desiredSampRate: 16000,
          numberOfAudioChannels: 1,
          bufferSize: 4096,
          audioBitsPerSecond: 128000,
          ondataavailable: async (blob) => {
            clearTimeout(silenceTimeout);
            const buffer = await blob.arrayBuffer();
            silenceTimeout = setTimeout(() => {
              console.log('User stopped talking');
            }, 2000);
          },
        });
  
        recorder.current.startRecording();
        console.log("current data", recorder.current);
      } catch (err) {
        console.error(err);
      }
    }
  };
  

  const disconnect=(e)=>{
      e.preventDefault();
      recorder.current.pauseRecording();
      recorder.current=null;
      setEnablemic(false);
  }

  return (
    <div className='-mt-15'>
      <h2 className='text-lg font-bold'>{DiscussionRoomData?.coachingOption}</h2>
      <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>
        <div className='lg:col-span-2'>
        <div className='lg:col-span-2 h-[60vh] bg-secondary border rounded-4xl
         flex flex-col items-center justify-center relative'>
          {expert?.avatar ?(
              <Image src={expert.avatar} alt='Avatar' height={200} width={200}
              className='h-[80px] w-[80px] rounded-full object-cover animate-pulse'/>
          ):null}  
            <h2 className='text-gray-500'>{expert?.name}</h2>   

            <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10 '>
              <UserButton/>
              </div>    
        </div>
        <div className='mt-5 flex justify-center items-center'>
          {!enableMic?
          <Button onClick={connectToServer} className="bg-[linear-gradient(45deg,_#64C2DB,_#7476ED,_#C994DF,_#E56F8C)] cursor-pointer">Connect</Button>
          : <Button variant={'destructive'} onClick={disconnect} className={'cursor-pointer'}>Disconnect</Button>}
        </div>
        </div>
        <div>
        <div className='h-[60vh] bg-secondary border rounded-4xl
         flex flex-col items-center justify-center relative'>
            <h2>Chat Section</h2>
        </div>
        <h2 className='mt-5 text-gray-400 text-sm'>At the end of your coversation we will automatically generate feedback/notes from your conversation</h2>
        </div>
      </div>
      </div>
  )
}

export default DiscussionRoom 