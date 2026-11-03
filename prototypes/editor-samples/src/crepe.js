import { Crepe } from '@milkdown/crepe'
import '@milkdown/crepe/theme/common/style.css'
import '@milkdown/crepe/theme/frame.css'

window.mountCrepe = (el, markdown) => {
  const crepe = new Crepe({ root: el, defaultValue: markdown })
  crepe.create()
  return crepe
}
