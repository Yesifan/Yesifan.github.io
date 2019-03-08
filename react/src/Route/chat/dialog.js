export const dialog = {
  answer:{
    '0000':{
      dialog:[
        ['你好',{
          type:'img',
          src:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536570116809&di=57b843c27e015e1c770df362c109069d&imgtype=0&src=http%3A%2F%2Fimg.mp.sohu.com%2Fupload%2F20170809%2F796191908b6c453198c7035a0c3901aa_th.png'
        }]
      ],
      response:[
        {
          dialog:[
            ['你好']
          ],
          next:'0001'
        }
      ]
    },
    '0001':{
      dialog:[
        [`君不见，黄河之水天上来，奔流到海不复回。
          君不见，高堂明镜悲白发，朝如青丝暮成雪。
          人生得意须尽欢，莫使金樽空对月。
          天生我材必有用，千金散尽还复来。
          烹羊宰牛且为乐，会须一饮三百杯。
          岑夫子，丹丘生，将进酒，杯莫停。
          与君歌一曲，请君为我倾耳听。
          钟鼓馔玉不足贵，但愿长醉不复醒。
          古来圣贤皆寂寞，惟有饮者留其名。
          陈王昔时宴平乐，斗酒十千恣欢谑。
          主人何为言少钱，径须沽取对君酌。
          五花马，千金裘，呼儿将出换美酒，与尔同销万古愁。`]
      ]
    }
  },
  qusition:{
    work:{
      brief:'工作',
      dialog:[
        ['你好','你工作怎么样']
      ],
      next:'0000'
    }
  }
}

export default dialog;