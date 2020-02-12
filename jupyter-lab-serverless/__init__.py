
def load_jupyter_server_extension(nb_server_app):
    """
    Called when the extension is loaded.
    """
    nb_server_app.log.info('serverless module enabled')