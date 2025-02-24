import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex justify-center items-center'>

      <img src="/africa24_main_logo.png" alt="NotFound" />
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}