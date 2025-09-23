import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <center className="flex items-center justify-center h-screen">
      <SignIn />
    </center>
  )
}