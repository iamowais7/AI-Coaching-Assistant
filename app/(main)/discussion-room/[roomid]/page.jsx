"use client"

import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import React from 'react'

function DiscussionRoom () {
  const {roomid} = useParams()
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom,{id:roomid});
  console.log(DiscussionRoomData);

  return (
    <div>
      Discussion room 
      </div>
  )
}

export default DiscussionRoom 