import _ from 'lodash'

const BATCH_SIZE = 20

const batch = async (files: (() => Promise<any>)[]) => {
  const chunks = _.chunk(files, BATCH_SIZE)
  for (let c of chunks) {
    await Promise.all(c.map(job => job()))
  }
}

export default batch
