function handleError(err, req, res, error) {
  if (err.kind === 'ObjectId') {
    res.status(404).send({ message: 'Id not found' })
  } else {
    res.status(500).send({ err })
  }
}

export default handleError
