import './pages.css'
import AnimatedText from '../components/mainText'
import gsap from 'gsap'
import { useLayoutEffect, useMemo, useRef } from 'react'
import wavesSvg from '../assets/diagonal-waves.svg?raw'
import a1 from '../assets/animal/1.png'
import a2 from '../assets/animal/2.png'
import a3 from '../assets/animal/3.png'
import a4 from '../assets/animal/4.png'
import a5 from '../assets/animal/5.png'
import a6 from '../assets/animal/6.png'
import a7 from '../assets/animal/7.png'
import a8 from '../assets/animal/8.png'
type Props = {
  onStart: () => void
}

export default function StartPage({ onStart }: Props) {
  const wavesRef = useRef<HTMLDivElement | null>(null)
  const wavesHtml = useMemo(() => wavesSvg.replaceAll('#7CC4FF', '#CFEAFF'), [])
  const animalImages = useMemo(() => [a1, a2, a3, a4, a5, a6, a7, a8], [])
  const sliderImages = useMemo(() => [...animalImages, animalImages[0]], [animalImages])
  const sliderWrapRef = useRef<HTMLDivElement | null>(null)
  const sliderTrackRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const container = wavesRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      const svgEl = container.querySelector('svg') as SVGSVGElement | null
      if (!svgEl) return

      // 초기 상태 세팅
      const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
      gsap.set(svgEl, {
        position: 'absolute',
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        width: isMobile ? '140vw' : '300%',
        height: isMobile ? '140vh' : '300%',
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

  // Animal 슬라이더 (흑백/어둡게 + 중앙 '?')
  useLayoutEffect(() => {
    const wrap = sliderWrapRef.current
    const track = sliderTrackRef.current
    if (!wrap || !track) return
    const build = () => {
      const w = wrap.getBoundingClientRect().width
      const slideDuration = 0.8
      const hold = 1.2
      const total = sliderImages.length
      const tl = gsap.timeline({ repeat: -1 })
      gsap.set(track, { x: 0 })
      for (let i = 1; i < total; i++) {
        tl.to(track, { x: -w * i, duration: slideDuration, ease: 'power2.inOut' }, `+=${hold}`)
      }
      tl.eventCallback('onRepeat', () => {
        gsap.set(track, { x: 0 })
      })
      return tl
    }
    let tl = build()
    const onResize = () => {
      tl && tl.kill()
      tl = build()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      tl && tl.kill()
    }
  }, [sliderImages])

  return (
    <div className="relative p-6 max-w-md mx-auto">
      <div
        ref={wavesRef}
        className="pointer-events-none fixed inset-0 md:absolute md:inset-0 -z-10 opacity-70 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: wavesHtml }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="text-left">
          <h1 className="text-2xl font-bold mb-2">나만의 해양 동물 찾기!</h1>
          <p className="text-sm text-gray-500 mb-2">
            여가 생활 분석으로 나만의<br/>
            해양 동물 캐릭터를 만나 보아요         
          </p>
        </div>
        <div className="shrink-0 ml-2">
          <AnimatedText />
        </div>
      </div>
      <button className="w-full py-3 rounded-md bg-black text-white dark:bg-white dark:text-black" onClick={onStart}>
        테스트 시작하기
      </button>
      <button
        className="mt-3 w-full py-3 rounded-md bg-yellow-400 text-black hover:bg-yellow-300 dark:bg-yellow-300 dark:text-black"
        onClick={() => {
          const url = 'https://qr.kakaopay.com/FTO1rHse9'
          window.open(url, '_blank', 'noopener')
        }}
      >
        💛 YDP.Lab 응원하기 (카카오 송금)
      </button>
      {/* Animal 슬라이더 */}
      <div ref={sliderWrapRef} className="mt-4 relative overflow-hidden rounded-md h-full">
        <div ref={sliderTrackRef} className="flex h-full">
          {sliderImages.map((src, idx) => (
            <div key={idx} className="relative w-full h-full shrink-0">
              <img
                alt={`animal-${idx}`}
                src={src}
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(1) brightness(0)' }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-5xl">?
                {/* <div className="w-10 h-10 rounded-full bg-white text-black text-2xl font-bold flex items-center justify-center shadow">
                  ?
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-gray-500">
        본 서비스는 어떠한 사용자 데이터도 저장하지 않습니다.
      </p>
      
    </div>
  )
}


