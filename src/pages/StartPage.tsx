import './pages.css'
import AnimatedText from '../components/mainText'
import dol1 from '../assets/dolphine-1.png'
import dol2 from '../assets/dolphine-2.png'
import gsap from 'gsap'
import { useLayoutEffect, useMemo, useRef } from 'react'
import wavesSvg from '../assets/diagonal-waves.svg?raw'
type Props = {
  onStart: () => void
}

export default function StartPage({ onStart }: Props) {
  const wavesRef = useRef<HTMLDivElement | null>(null)
  const wavesHtml = useMemo(() => wavesSvg.replaceAll('#7CC4FF', '#CFEAFF'), [])

  useLayoutEffect(() => {
    const container = wavesRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      const svgEl = container.querySelector('svg') as SVGSVGElement | null
      if (!svgEl) return

      // 초기 상태 세팅
      gsap.set(svgEl, {
        position: 'absolute',
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        width: '300%',
        height: '300%',
        opacity: 1,
        rotation: 0,
        transformOrigin: 'center center',
      })

      const lines = gsap.utils.toArray('svg > g', container)

      const tl = gsap.timeline({ paused: false })
      tl.from(lines, {
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.06,
      }, 0)
        // 좌상단에서 우하단 방향의 대각선 진입
        .from('svg > g', {
          xPercent: -15,
          yPercent: -15,
          duration: 120,
          ease: 'expo.out',
        }, 0)

      return () => {}
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative p-6 max-w-md mx-auto">
      <div
        ref={wavesRef}
        className="pointer-events-none absolute inset-0 -z-10 opacity-70 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: wavesHtml }}
      />

      <div className="text-left">
        <h1 className="text-2xl font-bold mb-2">나만의 해양 동물 찾기!</h1>
        <p className="text-sm text-gray-500 mb-6">
          여가 생활 분석으로 나만의<br/>
          해양 동물 캐릭터를 만나 보아요         
        </p>
      </div>
      <button className="w-full py-3 rounded-md bg-black text-white dark:bg-white dark:text-black" onClick={onStart}>
        테스트 시작하기
      </button>
      <AnimatedText />
      <img alt="logo" src={dol1} />
      <img alt="logo" src={dol2} />
    </div>
  )
}


