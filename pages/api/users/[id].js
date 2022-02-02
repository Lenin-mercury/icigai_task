import { usersRepo } from 'helpers';

export default handler;

function handler(req, res) {
    switch (req.method) {
        case 'PUT':
            return updateUser();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    function updateUser() {
        try {
            usersRepo.updateItems(req.query.id, req.body);
            return res.status(200).json({});
        } catch (error) {
            return res.status(400).json({ message: error });
        }
    }
}
