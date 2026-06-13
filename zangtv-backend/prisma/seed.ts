import { PrismaClient, ChannelQuality } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
const prisma = new PrismaClient()
async function main() {
  console.log('Seeding ZangTV database...')
  const kurdish  = await prisma.category.upsert({ where:{slug:'kurdish'},  update:{}, create:{slug:'kurdish',  nameKu:'کوردی',   nameAr:'الكردية',nameEn:'Kurdish',  icon:'🟡',color:'#FF6B35',sortOrder:1}})
  const news     = await prisma.category.upsert({ where:{slug:'news'},     update:{}, create:{slug:'news',     nameKu:'هەواڵ',   nameAr:'الأخبار',nameEn:'News',     icon:'📰',color:'#2196F3',sortOrder:2}})
  const sports   = await prisma.category.upsert({ where:{slug:'sports'},   update:{}, create:{slug:'sports',   nameKu:'وەرزش',  nameAr:'الرياضة',nameEn:'Sports',   icon:'⚽',color:'#4CAF50',sortOrder:3}})
  const children = await prisma.category.upsert({ where:{slug:'children'}, update:{}, create:{slug:'children', nameKu:'منداڵان', nameAr:'أطفال',  nameEn:'Children', icon:'🧒',color:'#FF9800',sortOrder:4}})
  const movies   = await prisma.category.upsert({ where:{slug:'movies'},   update:{}, create:{slug:'movies',   nameKu:'فیلم',    nameAr:'أفلام',  nameEn:'Movies',   icon:'🎬',color:'#F44336',sortOrder:6}})
  const arabic   = await prisma.category.upsert({ where:{slug:'arabic'},   update:{}, create:{slug:'arabic',   nameKu:'عەرەبی',  nameAr:'عربية',  nameEn:'Arabic',   icon:'🌍',color:'#00BCD4',sortOrder:7}})
  console.log('✓ Categories created')
  const channels = [
    {slug:'kurdsat-hd',   nameKu:'Kurdsat HD',    streamUrl:'https://ottott.us/live/iptv_IQKRDKRDST1/iptv_IQKRDKRDST1/index.m3u8',categoryId:kurdish.id, country:'IQ',language:'ku',quality:'HD' as ChannelQuality,isFeatured:true, sortOrder:1},
    {slug:'rudaw-tv',     nameKu:'Rudaw TV',       streamUrl:'https://rudawlive.net/livekurd/smil:rudawkurd.smil/playlist.m3u8',    categoryId:kurdish.id, country:'IQ',language:'ku',quality:'FHD'as ChannelQuality,isFeatured:true, sortOrder:2},
    {slug:'kurdistan-24', nameKu:'Kurdistan 24',   streamUrl:'https://live.kurdistan24.net/live/smil:kurdistan24.smil/playlist.m3u8',categoryId:kurdish.id,country:'IQ',language:'ku',quality:'HD' as ChannelQuality,isFeatured:true, sortOrder:3},
    {slug:'nrt-tv',       nameKu:'NRT TV',         streamUrl:'https://nrttv.com/live/nrttv/smil:nrttv.smil/playlist.m3u8',         categoryId:kurdish.id, country:'IQ',language:'ku',quality:'HD' as ChannelQuality,isFeatured:false,sortOrder:4},
    {slug:'gali-tv',      nameKu:'GaliTV',         streamUrl:'https://galistream.com/live/gali/smil:gali.smil/playlist.m3u8',       categoryId:kurdish.id, country:'IQ',language:'ku',quality:'HD' as ChannelQuality,isFeatured:false,sortOrder:5},
    {slug:'bein-sports-1',nameKu:'beIN Sports 1',  streamUrl:'https://bein.net/live/bein1/playlist.m3u8',                          categoryId:sports.id,  country:'QA',language:'ar',quality:'FHD'as ChannelQuality,isFeatured:true, sortOrder:1},
    {slug:'al-jazeera',   nameKu:'Al Jazeera',     streamUrl:'https://live-hls-web-ajm.getaj.net/AJM/03.m3u8',                    categoryId:news.id,    country:'QA',language:'ar',quality:'FHD'as ChannelQuality,isFeatured:true, sortOrder:1},
    {slug:'france-24-ar', nameKu:'France 24',      streamUrl:'https://f24hls-i.akamaihd.net/hls/live/221193/F24_AR_LO/master.m3u8',categoryId:news.id,   country:'FR',language:'ar',quality:'HD' as ChannelQuality,isFeatured:false,sortOrder:2},
    {slug:'mbc3',         nameKu:'MBC 3',          streamUrl:'https://mbc.net/live/mbc3/playlist.m3u8',                            categoryId:children.id,country:'SA',language:'ar',quality:'HD' as ChannelQuality,isFeatured:false,sortOrder:1},
    {slug:'mbc1',         nameKu:'MBC 1',          streamUrl:'https://mbc.net/live/mbc1/playlist.m3u8',                            categoryId:arabic.id,  country:'SA',language:'ar',quality:'HD' as ChannelQuality,isFeatured:false,sortOrder:1},
    {slug:'rotana-cinema',nameKu:'Rotana Cinema',  streamUrl:'https://rotana.net/live/cinema/playlist.m3u8',                       categoryId:movies.id,  country:'SA',language:'ar',quality:'HD' as ChannelQuality,isFeatured:false,sortOrder:1},
  ]
  for (const ch of channels) {
    await prisma.channel.upsert({ where:{slug:ch.slug}, update:{}, create:{...ch,tags:[]} })
  }
  console.log(`✓ ${channels.length} channels created`)
  const pw = await bcrypt.hash('Admin@ZangTV2026!', 12)
  await prisma.user.upsert({ where:{email:'admin@zangtv.com'}, update:{}, create:{name:'Admin',email:'admin@zangtv.com',passwordHash:pw,role:'admin',plan:'premium',isVerified:true} })
  console.log('✓ Admin: admin@zangtv.com / Admin@ZangTV2026!')
  console.log('Seed complete!')
}
main().catch(console.error).finally(()=>prisma.$disconnect())
